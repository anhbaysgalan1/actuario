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
  const sciencePacks: string[] = _.get(state, 'data.factorio.goals.science.sciencePacks');

  const getDescription: (packName: string) => string = packName =>
    _.get(state, `factorio.recipes.${packName}.description`)
    || fallbackDescriptions[packName];

  const packDescriptions: { [packName: string]: string } = _(sciencePacks || [])
    .map(packName => [packName, getDescription(packName)])
    .fromPairs()
    .value();

  return { ...scienceGoals, sciencePacks: packDescriptions };
};

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  toggleGoal: () => dispatch(GoalActions.toggleGoal('science')),
  setPackRate: (newRate: number) => dispatch(GoalActions.setSciencePackRate(newRate)),
  togglePackEnabled: (packName: string) => dispatch(GoalActions.toggleSciencePackEnabled(packName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScienceGoal);
