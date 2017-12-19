import { List } from 'immutable';
import { connect, Dispatch } from 'react-redux';

import GoalActions from '../actions/goals';
import GoalCard from '../components/GoalCard';
import { calculateProductionDetails } from '../math/productionDetails';
import { FactorioData } from '../types/factorio';
import { ProductionDetails } from '../types/props';
import { ActuarioState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => {
    const scienceGoals = state.user.factory.goals.science;

    let production: List<ProductionDetails>;
    if (state.data.factorio)
        production = scienceGoals.sciencePacks
            .map((crafters, recipeName) =>
                calculateProductionDetails(recipeName, crafters, state.data.factorio as FactorioData))
            .toList();
    else
        production = List();

    return { enabled: scienceGoals.enabled, production, title: 'Science' };
};

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
    toggleGoal: () => dispatch(GoalActions.toggleGoal('science')),
    updateProduction: (newProduction: ProductionDetails) => dispatch(GoalActions.updateProduction(newProduction))
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
