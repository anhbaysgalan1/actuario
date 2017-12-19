import { List, Map } from 'immutable';
import { Switch } from 'material-ui';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import { FormControlLabel } from 'material-ui/Form';
import ListComponent, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import { StyleRules, withStyles } from 'material-ui/styles';
import Spacing from 'material-ui/styles/spacing';
import { WithStyles } from 'material-ui/styles/withStyles';
import * as React from 'react';
import { Action } from 'redux-act';

import { formatRate } from '../math/rates';
import { ProductionDetails } from '../types/props';
import { Goals } from '../types/state';

import ItemIcon from './ItemIcon';
import ProductionDialog from './ProductionDialog';

export interface GoalCardProps {
    readonly title: string;
    readonly enabled: boolean;
    readonly production: List<ProductionDetails>;
    readonly toggleGoal: () => Action<keyof Goals>;
    readonly updateProduction: (newProduction: ProductionDetails) => Action<ProductionDetails>;
}

const styles: StyleRules = {
    title: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
        marginBottom: Spacing.unit * 2
    }
};

interface GoalCardState {
    readonly dialogs: Map<string, boolean>;
}

class GoalCard extends React.Component<GoalCardProps & WithStyles, GoalCardState> {

    constructor(props: GoalCardProps & WithStyles) {
        super(props);
        this.state = { dialogs: Map() };
    }

    componentWillReceiveProps(newProps: GoalCardProps & WithStyles) {
        if (this.state.dialogs.isEmpty() && !newProps.production.isEmpty())
            this.setState({
                dialogs: Map(newProps.production.map<[string, boolean]>(
                    production => [production.name, false])) });
    }

    toggleDialog(recipeName: string, open: boolean) {
        this.setState({ dialogs: this.state.dialogs.set(recipeName, open) });
    }

    render() {
        const { title, classes, enabled, production, ...handlers } = this.props;

        const enabledSwitch = <Switch checked={enabled} onChange={() => handlers.toggleGoal()} />;

        const cardTitle = (
            <div className={classes.title}>
                <span>{title}</span>
                <FormControlLabel control={enabledSwitch} label="Enabled" color="accent" />
            </div>
        );

        if (!enabled)
            return <Card><CardHeader title={cardTitle} /></Card>;

        const productionListItems = production.map(recipeProduction => {
            const { name, description, resultRates } = recipeProduction;
            return (
                <ListItem button onClick={() => this.toggleDialog(name, true)} key={name}>
                    <ListItemAvatar>
                        <ItemIcon name={name} description={description}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={description}
                        secondary={`Rate: ${formatRate(resultRates[name])}`}
                    />
                </ListItem>
            );
        });
        
        const dialogs = production.map(recipeProduction => {
            const { name } = recipeProduction;
            return (
                <ProductionDialog
                    key={`dialog-${name}`}
                    isOpen={this.state.dialogs.get(name, false)}
                    production={recipeProduction}
                    cancel={() => this.toggleDialog(name, false)}
                    save={(newProduction) => {
                        this.toggleDialog(name, false);
                        return handlers.updateProduction(newProduction);
                    }}
                />
            );
        });

        return (
            <Card className={classes.card}>
                <CardHeader title={cardTitle} />
                <CardContent className={enabled ? classes.enabledContents : classes.disabledContents}>
                    <ListComponent>{productionListItems}</ListComponent>
                </CardContent>
                {dialogs}
            </Card>
        );
    }
}

export default withStyles(styles)(GoalCard);
