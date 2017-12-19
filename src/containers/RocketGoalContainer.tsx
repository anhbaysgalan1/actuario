import { List } from 'immutable';
import { connect, Dispatch } from 'react-redux';

import GoalActions from '../actions/goals';
import GoalCard from '../components/GoalCard';
import { calculateProductionDetails } from '../math/productionDetails';
import { FactorioData } from '../types/factorio';
import { ProductionDetails } from '../types/props';
import { ActuarioState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => {
    const rocketGoal = state.user.factory.goals.rocket;

    let production: List<ProductionDetails>;
    if (state.data.factorio)
        production = List([calculateProductionDetails(
            'rocket-part',
            rocketGoal.production,
            state.data.factorio as FactorioData)]);
    else
        production = List();

    return { enabled: rocketGoal.enabled, production, title: 'Rocket' };
};

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
    toggleGoal: () => dispatch(GoalActions.toggleGoal('rocket')),
    updateProduction: (newProduction: ProductionDetails) => dispatch(GoalActions.updateProduction(newProduction))
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
