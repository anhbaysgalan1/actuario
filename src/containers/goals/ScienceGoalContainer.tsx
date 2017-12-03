import { connect, Dispatch } from 'react-redux';
import * as _ from 'lodash';

import ScienceGoal from '../../components/goals/ScienceGoal';
import GoalActions from '../../actions/user/goals';
import { ActuarioState } from '../../types/state';

const fallbackDescriptions: { [name: string]: string } = {
  'space-science-pack': 'Space Science Pack',
};

const mapStateToProps = (state: ActuarioState) => {
  const scienceGoals = state.user.factory.goals.science;
  const packNames = _.keys(scienceGoals.sciencePacks);

  const getDescription: (packName: string) => string = packName =>
    _.get(state, `factorio.recipes.${packName}.description`)
    || fallbackDescriptions[packName];

  const packDescriptions: { [packName: string]: string } = _(packNames || [])
    .map(packName => [packName, getDescription(packName)])
    .fromPairs()
    .value();

  return { ...scienceGoals, packDescriptions };
};

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  toggleGoal: () => dispatch(GoalActions.toggleGoal('science')),
  addCrafter: (recipe: string, crafter: string) => dispatch(GoalActions.addCrafter({ recipe, crafter })),
  subtractCrafter: (recipe: string, crafter: string) => dispatch(GoalActions.removeCrafter({ recipe, crafter })),
  addModule: (recipe: string, module: string) => dispatch(GoalActions.addModule({ recipe, module })),
  subtractModule: (recipe: string, module: string) => dispatch(GoalActions.removeModule({ recipe, module }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ScienceGoal);
