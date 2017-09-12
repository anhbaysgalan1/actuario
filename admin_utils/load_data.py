import os, shutil, sys, json, tarfile, re, inflection, traceback
from itertools import groupby
import os.path as path

import firebase_admin
from firebase_admin import db, credentials

config = {
    'nt': {
        'factorio-path': r'C:\Program Files (x86)\Steam\steamapps\common\Factorio',
        'firebase-key': r'E:\actuario-564a6-firebase-adminsdk-rtaqt-697820f9cc.json'
    },
    'posix': {
        'factorio-path': '/media/willj/seagate/Steam Library - Linux/steamapps/common/Factorio',
    }
}[os.name]
_factorio_version = None
_item_descriptions = None
_factorio_data = None

# whether to actually send these to the database or just read them from disk
_write_recipes, _write_entities, _write_icons = (True, True, False)

firebase_cred = credentials.Certificate(config['firebase-key'])
actuario_app = firebase_admin.initialize_app(firebase_cred, options={
    'databaseURL': 'https://actuario-564a6.firebaseio.com/',
    'storageBucket': 'actuario-564a6.appspot.com'
})


def factorio_version():
    global _factorio_version

    if _factorio_version is None:

        factorio_info_path = path.join(config['factorio-path'], 'data/base/info.json')
        if not path.isfile(factorio_info_path):
            print('Could not find info file at {}'.format(factorio_info_path), file=sys.stderr)
            sys.exit(1)

        with open(factorio_info_path) as factorio_info_file:
            _factorio_version = json.load(factorio_info_file)['version']

    return _factorio_version


def load_item_descriptions():
    global _item_descriptions

    if _item_descriptions is None:
        _item_descriptions = dict()

        locale_cfg_file = path.join(config['factorio-path'], 'data/base/locale/en/base.cfg')
        relevant_sections = ['entity-name', 'item-name', 'fluid-name', 'recipe-name', 'equipment-name']
        with open(locale_cfg_file) as locale_cfg:
            current_section = None
            section_header_re = re.compile(r'\[([a-z\\-]+)\]')
            for line in locale_cfg:
                section_header_match = section_header_re.match(line.strip())
                if section_header_match:
                    _current_section = section_header_match[1]

                    if _current_section in relevant_sections:
                        current_section = _current_section
                    else:
                        current_section = None

                    continue
                elif current_section and len(line.strip()) > 0:
                    name, desc = line.strip().split('=')
                    _item_descriptions[name] = desc

        for sf_recipe in ['solid-fuel-from-' + p for p in ['light-oil', 'petroleum-gas', 'heavy-oil']]:
            _item_descriptions[sf_recipe] = _item_descriptions['solid-fuel']


def item_description(item_name):
    if _item_descriptions is None:
        load_item_descriptions()

    return _item_descriptions.get(item_name)


def db_root():
    formatted_version = '_'.join(factorio_version().split('.'))
    root_data_folder = 'factorio-data/v{}'.format(formatted_version)
    return db.reference(root_data_folder, app=actuario_app)


def load_data():
    global _factorio_data

    factorio_datafile = 'data_{version}.tar.gz'.format(version=factorio_version())

    if not path.isfile(factorio_datafile):
        print('Could not find data file {}'.format(factorio_datafile), file=sys.stderr)
        sys.exit(1)

    _factorio_data = dict()
    with tarfile.open(factorio_datafile) as data_tar:
        for member in data_tar.getmembers():
            _factorio_data[path.splitext(member.name)[0]] = json.load(data_tar.extractfile(member.name))


def data_segment(segment):
    if _factorio_data is None:
        load_data()

    return _factorio_data[segment]


def load_recipes():

    items = data_segment('item')
    recipes = data_segment('recipe')

    def get_normal_spec(raw_recipe):
        return recipe.get('normal', raw_recipe)

    def normalize_ingredientish(i):
        if type(i) is dict: return i['name'], i['amount']
        else: return tuple(i)

    def normalize_results(raw_recipe):
        """
        Turns a recipe with one of several possible result formats into a dictionary from result name to result count.
        :param raw_recipe: the recipe
        :return: (results, avg_t), where results is a dict[string, int], and avg_t is the number of cycles that
                 must be averaged over to produce the given results, or None if the recipe is not probabilistic.
        """
        if 'results' in raw_recipe:
            results = raw_recipe['results']

            if 'probability' in results[0]:
                ps = [r['probability'] for r in raw_recipe['results']]
                cycles = 1
                while len(list(filter(lambda p: (p * cycles).is_integer(), ps))) < len(ps):
                    cycles *= 10

                return dict([(r['name'], int(r['amount'] * r['probability'] * cycles)) for r in results]), cycles

            else:
                return dict([normalize_ingredientish(r) for r in results]), None
        else:
            return {raw_recipe['result']: raw_recipe.get('result_count', 1)}, None

    def item_icon(item_name):
        try:
            return next(i['icon'] for i in items if i['name'] == item_name and 'icon' in i)
        except StopIteration:
            return None

    db_recipes = dict()
    icons = dict()

    ignore_recipes = ['electric-energy-interface']

    for recipe in recipes:
        if recipe is None or recipe['type'] != 'recipe' or recipe['name'] in ignore_recipes:
            continue

        recipe_name = recipe['name']

        try:
            db_icon_path = '{}.png'.format(recipe_name)
            if 'icon' in recipe:
                icons[recipe_name] = recipe['icon']
            elif recipe.get('subgroup', None) != 'fluid-recipes':
                icon_path_from_item = item_icon(recipe_name)
                if icon_path_from_item is not None:
                    icons[recipe_name] = icon_path_from_item
                else:
                    print('cannot find icon for {}'.format(recipe_name), file=sys.stderr)

            if db_icon_path != '{}.png'.format(recipe_name):
                print('weird icon filename {} for recipe {}'.format(db_icon_path, recipe_name))

            db_path = 'recipes/{}'.format(recipe_name)

            r_spec = get_normal_spec(recipe)
            normalized_results, avg_cycles = normalize_results(r_spec)
            normalized_effort = r_spec.get('energy_required', 0.5) * (avg_cycles if avg_cycles is not None else 1)

            recipe_description = item_description(recipe_name)
            if recipe_description is None:
                print('no description available for recipe {}'.format(recipe_name), file=sys.stderr)

            db_recipes[db_path] = {
                'name': recipe_name,
                'description': recipe_description,
                'category': recipe.get('category', 'crafting'),
                'effort': normalized_effort,
                'ingredients': dict([normalize_ingredientish(i) for i in r_spec['ingredients']]),
                'results': normalized_results,
            }
        except:
            print('failed to process recipe {}'.format(recipe_name), file=sys.stderr)
            traceback.print_exc()

    if _write_recipes:
        try:
            for db_path, recipe in db_recipes.items():
                db_root().child(db_path).set(recipe)
        except:
            print('error while loading recipes into db', file=sys.stderr)
            traceback.print_exc()
            sys.exit(2)

    print('loaded {:d} recipes'.format(len(db_recipes)))
    return icons


def load_entities():

    entities = data_segment('entity')

    power_re = re.compile('([0-9]+)(w|kw|mw|gw)?', flags=re.IGNORECASE)
    power_conversion_kw = {'w': 1.e3, 'kw': 1.e0, 'mw': 1.e-3, 'gw': 1.e-6}

    def normalize_power_kw(power):
        if type(power) is int or type(power) is float:
            return float(power) * power_conversion_kw['w']
        elif type(power) is str:
            match = power_re.match(power)
            if match:
                unit = (match[2] or 'W').lower()
                return float(match[1]) * power_conversion_kw[unit]
            else:
                print('cannot read power rate: {}'.format(power), file=sys.stderr)
        else:
            print('do not know how to read power rate of type {} (value: {})'
                  .format(type(power), power),
                  file=sys.stderr)

    def calculate_energy_usage(entity_data):

        energy_type = 'electric'
        power_raw = '0kW'
        fuel_efficiency = 1.

        if entity_data['type'] == 'inserter':
            if 'drain' in entity_data['energy_source']:
                power_raw = entity_data['energy_source']['drain']
        elif 'energy_usage' in entity_data:
            power_raw = entity_data['energy_usage']

        if 'energy_source' in entity_data:
            if entity_data['energy_source']['type'] == 'burner':
                energy_type = entity_data['energy_source']['fuel_category']
                fuel_efficiency = float(entity_data['energy_source']['effectivity'])

        return {
            'type': energy_type,
            'rate-kw': normalize_power_kw(power_raw),
            'fuel-efficiency': fuel_efficiency
        }

    def base_entity(entity_data):
        entity_name = entity_data['name']
        entity_description = item_description(entity_name)
        if entity_description is None:
            print('no description available for entity {}'.format(entity_name), file=sys.stderr)

        return entity['icon'], {
            'name': entity_name,
            'description': entity_description,
            'energy-usage': calculate_energy_usage(entity_data),
            'module-slots': entity_data.get('module_specification', dict()).get('module_slots', 0)
        }

    db_entities = dict()
    icons = dict()

    for entity in entities:
        relevant_entity_types = ['assembling-machine', 'furnace', 'rocket-silo', 'inserter', 'transport-belt',
                                 'mining-drill', 'lab']

        if entity is None or entity['type'] not in relevant_entity_types:
            continue

        try:
            icon_path, db_entity = base_entity(entity)

            entity_name = entity['name']

            icons[entity_name] = icon_path

            def copy_kebabed(*keys):
                for key in keys:
                    db_entity[inflection.dasherize(key)] = entity[key]

            if entity['type'] in ['assembling-machine', 'furnace', 'rocket-silo']:
                db_path = 'crafters/{}'.format(entity_name)
                copy_kebabed('crafting_categories', 'crafting_speed')

            elif entity['type'] == 'inserter':
                db_path = 'inserters/{}'.format(entity_name)
                copy_kebabed('rotation_speed', 'extension_speed')
                db_entity['energy-per-movement-kj'] = entity['energy_per_movement'] / 1.e3
                db_entity['energy-per-rotation-kj'] = entity['energy_per_rotation'] / 1.e3

            elif entity['type'] == 'transport-belt':
                db_path = 'belts/{}'.format(entity_name)
                copy_kebabed('speed')

            elif entity['type'] == 'mining-drill':
                db_path = 'drills/{}'.format(entity_name)
                copy_kebabed('mining_speed', 'mining_power')

            elif entity['type'] == 'lab':
                db_path = 'goals/lab'
                copy_kebabed('researching_speed', 'inputs')

            else:
                continue

            db_entities[db_path] = db_entity
        except:
            print('error while processing entity: {}'.format(json.dumps(entity)), file=sys.stderr)
            traceback.print_exc()

    try:
        rocket_silo_entity = next(e for e in entities
                                  if e is not None and e['name'] == 'rocket-silo')

        db_entities['goals/rocket'] = {
            'rocket-parts-required': rocket_silo_entity['rocket_parts_required']
        }

    except StopIteration:
        print('could not find entity with name rocket-silo', file=sys.stderr)
    except:
        print('error while processing rocket goal', file=sys.stderr)
        traceback.print_exc()

    if _write_entities:
        try:
            for db_path, entity in db_entities.items():
                db_root().child(db_path).set(entity)
        except:
            print('error loading entities into db', file=sys.stderr)
            traceback.print_exc()
            sys.exit(2)

    print('loaded {:d} entities:'.format(len(db_entities)))
    print(json.dumps({k: len(list(g))
                      for k, g in groupby(sorted(db_entities.keys()), lambda ep: path.dirname(ep))}, indent=2))

    return icons


def get_fluid_icons():
    fluids = data_segment('fluid')
    return {f['name']: f['icon'] for f in fluids}


def copy_icons(paths):
    if not _write_icons:
        return

    factorio_base_path = path.join(config['factorio-path'], 'data/base')
    actuario_icon_path = '../src/icons'
    if path.exists(actuario_icon_path) and not path.isdir(actuario_icon_path):
        print('Icon destination exists but is not a directory; aborting icon copy', file=sys.stderr)
        return
    elif not path.exists(actuario_icon_path):
        os.mkdir(actuario_icon_path)

    for item_name, factorio_rel_path in paths.items():
        if '__base__' not in factorio_rel_path:
            print('broken path? {}'.format(factorio_rel_path), file=sys.stderr)
            continue

        local_path = factorio_rel_path.replace('__base__', factorio_base_path)
        if not path.isfile(local_path):
            print('icon not a file: {}'.format(local_path), file=sys.stderr)
            continue

        dest_filename = path.join(actuario_icon_path, '{}.png'.format(item_name))
        shutil.copyfile(local_path, dest_filename)


if __name__ == '__main__':
    icon_paths = load_recipes()
    icon_paths.update(load_entities())
    icon_paths.update(get_fluid_icons())

    copy_icons(icon_paths)
