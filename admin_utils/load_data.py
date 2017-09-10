import os, sys, json, tarfile, re, inflection, traceback, math
from itertools import groupby
import os.path as path

"""
import firebase_admin
from firebase_admin import storage, db
from google.cloud.storage import Blob

actuario_app = firebase_admin.initialize_app()
"""

factorio_path = {
    'nt': r'C:\Program Files (x86)\Steam\steamapps\common\Factorio',
    'posix': '/media/willj/seagate/Steam Library - Linux/steamapps/common/Factorio'
}


def load_data():
    factorio_info_path = path.join(factorio_path[os.name], 'data/base/info.json')
    if not path.isfile(factorio_info_path):
        print('Could not find info file at {}'.format(factorio_info_path), file=sys.stderr)
        sys.exit(1)

    with open(factorio_info_path) as factorio_info_file:
        factorio_version = json.load(factorio_info_file)['version']

    factorio_datafile = 'data_{version}.tar.gz'.format(version=factorio_version)

    if not path.isfile(factorio_datafile):
        print('Could not find data file {}'.format(factorio_datafile), file=sys.stderr)
        sys.exit(1)

    with tarfile.open(factorio_datafile) as data_tar:
        return {path.splitext(member.name)[0]: json.load(data_tar.extractfile(member.name))
                for member in data_tar.getmembers()}


def load_recipes(data):

    def get_normal_spec(recipe):
        return recipe.get('normal', recipe)

    def normalize_ingredientish(i):
        if type(i) is dict: return i['name'], i['amount']
        else: return tuple(i)

    def normalize_results(recipe):
        """
        Turns a recipe with one of several possible result formats into a dictionary from result name to result count.
        :param recipe: the recipe
        :return: (results, avg_t), where results is a dict[string, int], and avg_t is the number of cycles that
                 must be averaged over to produce the given results, or None if the recipe is not probabilistic.
        """
        if 'results' in recipe:
            results = recipe['results']

            if 'probability' in results[0]:
                ps = [r['probability'] for r in recipe['results']]
                cycles = 1
                while len(list(filter(lambda p: (p * cycles).is_integer(), ps))) > 1:
                    cycles *= 10

                return [{r['name']: int(r['amount'] * r['probability'] * cycles)} for r in results], cycles

            else:
                return dict([normalize_ingredientish(r) for r in results])
        else:
            return [{recipe['result']: recipe.get('result_count', 1)}], None

    db_recipes = dict()
    recipe_icon_paths = list()

    for recipe in data['recipe']:
        if recipe is None or recipe['type'] != 'recipe':
            continue

        try:
            db_icon_path = '{}.png'.format(recipe['name'])
            if 'icon' in recipe:
                recipe_icon_paths.append(recipe['icon'])
                db_icon_path = path.basename(recipe['icon'])

            if db_icon_path != '{}.png'.format(recipe['name']):
                print('weird icon filename {} for recipe {}'.format(db_icon_path, recipe['name']))

            db_path = 'recipe/{}'.format(recipe['name'])

            r_spec = get_normal_spec(recipe)

            db_recipes[db_path] = {
                'name': recipe['name'],
                'category': recipe.get('category', 'crafting'),
                'effort': r_spec.get('energy_required', 0.5),
                'ingredients': [normalize_ingredientish(i) for i in r_spec['ingredients']],
                'results': normalize_results(r_spec),
            }
        except:
            print('failed to process recipe {}'.format(recipe['name']), file=sys.stderr)
            traceback.print_exc()

    print('loaded {:d} recipes'.format(len(db_recipes)))
    return recipe_icon_paths


def load_entities(data):

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
            'rate': normalize_power_kw(power_raw),
            'fuel-efficiency': fuel_efficiency
        }

    def base_entity(entity_data):
        return entity['icon'], {
            'name': entity_data['name'],
            'energy-usage': calculate_energy_usage(entity_data),
            'module-slots': entity_data.get('module_specification', dict()).get('module_slots', 0)
        }

    db_entities = dict()
    entity_icon_paths = list()

    for entity in data['entity']:
        relevant_entity_types = ['assembling-machine', 'furnace', 'rocket-silo', 'inserter', 'transport-belt',
                                 'mining-drill', 'lab']

        if entity is None or entity['type'] not in relevant_entity_types:
            continue

        try:
            icon_path, db_entity = base_entity(entity)

            entity_icon_paths.append(icon_path)

            def copy_kebabed(*keys):
                for key in keys:
                    db_entity[inflection.dasherize(key)] = entity[key]

            if entity['type'] in ['assembling-machine', 'furnace', 'rocket-silo']:
                db_path = 'crafters/{}'.format(entity['name'])
                copy_kebabed('crafting_categories', 'crafting_speed')

            elif entity['type'] == 'inserter':
                db_path = 'inserters/{}'.format(entity['name'])
                copy_kebabed('rotation_speed', 'extension_speed')
                db_entity['energy-per-movement-kj'] = entity['energy_per_movement'] / 1.e3
                db_entity['energy-per-rotation-kj'] = entity['energy_per_rotation'] / 1.e3

            elif entity['type'] == 'transport-belt':
                db_path = 'belts/{}'.format(entity['name'])
                copy_kebabed('speed')

            elif entity['type'] == 'mining-drill':
                db_path = 'drills/{}'.format(entity['name'])
                copy_kebabed('mining_speed', 'mining_power')

            elif entity['type'] == 'lab':
                db_path = 'goals/lab'
                copy_kebabed('researching_speed', 'inputs')

            else:
                continue

            db_entities[db_path] = db_entity
        except:
            print('error while processing entity {}'.format(entity['name']), file=sys.stderr)
            traceback.print_exc()

    try:
        rocket_silo_entity = next(e for e in data['entity']
                                  if e is not None and e['name'] == 'rocket-silo')

        db_entities['goals/rocket'] = {
            'rocket-parts-required': rocket_silo_entity['rocket_parts_required']
        }

    except StopIteration:
        print('could not find entity with name rocket-silo', file=sys.stderr)
    except:
        print('error while processing rocket goal', file=sys.stderr)
        traceback.print_exc()

    print('loaded {:d} entities:'.format(len(db_entities)))
    print(json.dumps({k: len(list(g))
                      for k, g in groupby(sorted(db_entities.keys()), lambda ep: path.dirname(ep))}, indent=2))

    return entity_icon_paths


"""
def load_icons(paths):
    bucket = storage.bucket(app=actuario_app)
    factorio_base_path = path.join(factorio_path[os.name], 'data/base')

    for factorio_rel_path in paths:
        if '__base__' not in factorio_rel_path:
            print('broken path? {}'.format(factorio_rel_path), file=sys.stderr)
            continue

        local_path = factorio_rel_path.replace('__base__', factorio_base_path)
        if not path.isfile(local_path):
            print('icon not a file: {}'.format(local_path), file=sys.stderr)
            continue

        storage_filename = 'factorio-icons/{}'.format(path.basename(local_path))
        icon_blob = Blob(storage_filename, bucket)
        icon_blob.upload_from_filename(local_path)
"""


if __name__ == '__main__':
    factorio_data = load_data()

    icon_paths = []
    icon_paths += load_recipes(factorio_data)
    icon_paths += load_entities(factorio_data)

    # load_icons(icon_paths)

