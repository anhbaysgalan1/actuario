import { List, Map } from 'immutable';
import { connect, Dispatch } from 'react-redux';

import ResourceSheet from '../components/ResourceSheet';
import { calculateProductionDetails } from '../math/productionDetails';
import { calculateAllResources } from '../math/resources';
import { FactorioData } from '../types/factorio';
import { InvoiceDetail, ProductionDetails } from '../types/props';
import { ActuarioState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => {

    if (!state.data.factorio)
        return { invoice: Map() };

    const data = state.data.factorio as FactorioData;

    const { science, rocket } = state.user.factory.goals;

    const allProduction: ProductionDetails[] = [];

    if (rocket.enabled)
        allProduction.push(calculateProductionDetails('rocket-part', rocket.production, data));

    if (science.enabled) {
        const allScienceProduction = science.sciencePacks
            .filter(crafters => crafters.size > 0)
            .map((crafters, recipeName) => calculateProductionDetails(recipeName, crafters, data))
            .valueSeq()
            .toArray();
        allProduction.push(...allScienceProduction);
    }

    const basicInvoice = calculateAllResources(List(allProduction), data);
    const invoice = List(basicInvoice.map<InvoiceDetail>(
        (rate, resource) => ({ ...data.resources[resource], rate })).values());

    return { invoice };
};

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ResourceSheet);
