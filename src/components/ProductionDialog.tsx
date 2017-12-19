import { List } from 'immutable';
import * as _ from 'lodash';
import { Table, TableCell, TableHead, TextField } from 'material-ui';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions, DialogContent, DialogTitle, InjectedProps, withMobileDialog
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton/IconButton';
import { StyleRules } from 'material-ui/styles';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import Typography from 'material-ui/Typography/Typography';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { Action } from 'redux-act';

import CrafterPicker from '../containers/CrafterPicker';
import ModulePicker from '../containers/ModulePicker';
import { calculateResultRates } from '../math/productionDetails';
import { formatRate } from '../math/rates';
import { Module } from '../types/factorio';
import { CrafterDetails, ProductionDetails } from '../types/props';

import ItemIcon from './ItemIcon';

export interface ProductionDialogProps {
    readonly isOpen: boolean;
    readonly production: ProductionDetails;

    readonly cancel: () => void;
    readonly save: (newProduction: ProductionDetails) => Action<ProductionDetails>;
}

const styles: StyleRules = {
    iconCell: {
        width: 70
    },
    countCell: {
        minWidth: 80
    },
    modulesCell: {
        minWidth: 160
    }
};

type TotalProps = ProductionDialogProps & WithStyles & InjectedProps;

interface ProductionDialogState {
    readonly production: ProductionDetails;
}

class ProductionDialog extends React.Component<TotalProps, ProductionDialogState> {

    constructor(props: TotalProps) {
        super(props);
        this.state = { production: props.production };
    }

    updateCrafters(crafters: List<CrafterDetails>) {
        const production = {
            ...this.state.production,
            crafters,
            resultRates: calculateResultRates(this.state.production, crafters)
        };
        this.setState({ production });
    }

    updateCount(idx: number, newCount: number) {
        this.updateCrafters(this.state.production.crafters
            .update(idx, c => ({ ...c, count: newCount })));
    }

    updateModule(crafterIdx: number, moduleIdx: number, newModule: Module | null) {
        this.updateCrafters(this.state.production.crafters
            .update(crafterIdx, c => ({ ...c, modules: c.modules.set(moduleIdx, newModule) })));
    }

    removeCrafter(idx: number) {
        this.updateCrafters(this.state.production.crafters.delete(idx));
    }

    addCrafter(crafter: CrafterDetails) {
        this.updateCrafters(this.state.production.crafters.push(crafter));
    }

    handleCancel() {
        this.setState({ production: this.props.production });
        this.props.cancel();
    }

    render() {
        const { fullScreen, isOpen, classes } = this.props;
        const { save, cancel } = this.props;

        const { production: { resultRates, crafters, ...recipe } } = this.state;

        const tableRows = crafters.map((crafter, cIdx) => (
            <TableRow key={cIdx}>
                <TableCell padding="dense"><ItemIcon {...crafter} /></TableCell>
                <TableCell className={classes.countCell}>
                    <TextField
                        id={`crafter-${cIdx}`}
                        value={crafter.count}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            this.updateCount(cIdx, _.toInteger(e.target.value))}
                    />
                </TableCell>
                <TableCell className={classes.modulesCell} padding="dense">
                    {
                        crafter.modules.map((m, mIdx) =>
                            <ModulePicker
                                key={mIdx}
                                recipe={recipe.name}
                                selectedModule={m}
                                onSelect={(newModule: Module | null) => this.updateModule(cIdx, mIdx, newModule)}
                            />)
                    }
                </TableCell>
                <TableCell><IconButton onClick={() => this.removeCrafter(cIdx)}>delete</IconButton></TableCell>
            </TableRow>
        ));

        return (
            <Dialog
                fullWidth
                fullScreen={fullScreen}
                open={isOpen}
                onRequestClose={() => cancel()}
            >
                <DialogTitle>
                    {`Production Details: ${recipe.description}`}
                    <Typography type="caption">{`Rate: ${formatRate(resultRates[recipe.name])}`}</Typography>
                </DialogTitle>
                
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="dense">Crafter</TableCell>
                                <TableCell>Count</TableCell>
                                <TableCell>Modules</TableCell>
                                <TableCell>Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{tableRows}</TableBody>
                    </Table>
                </DialogContent>

                <DialogActions>
                    <CrafterPicker recipe={recipe.name} onSelect={(c) => this.addCrafter(c)} />
                    <Button onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button onClick={() => save(this.state.production)}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withMobileDialog<ProductionDialogProps>()(withStyles(styles)(ProductionDialog));
