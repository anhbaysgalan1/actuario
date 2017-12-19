import { Repeat } from 'immutable';
import * as _ from 'lodash';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { StyleRules, withStyles, WithStyles } from 'material-ui/styles';
import * as React from 'react';
import { SyntheticEvent } from 'react';
import { connect } from 'react-redux';

import ItemIcon from '../components/ItemIcon';
import { Crafter } from '../types/factorio';
import { CrafterDetails } from '../types/props';
import { ActuarioState } from '../types/state';

interface InnerProps {
    readonly availableCrafters: Crafter[];
    readonly onSelect: (crafter: CrafterDetails) => void;
}

export interface CrafterPickerProps {
    readonly recipe: string;
    readonly onSelect: (crafter: CrafterDetails) => void;
}

function mapStateToProps(state: ActuarioState, { recipe, onSelect }: CrafterPickerProps): InnerProps {
    if (_.isNil(state.data.factorio))
        return { availableCrafters: [], onSelect };
    
    const recipeCategory = state.data.factorio.recipes[recipe].category;
    const availableCrafters = _(state.data.factorio.crafters)
        .filter(c => _.includes(c.craftingCategories, recipeCategory))
        .sortBy((c: Crafter) => c.craftingSpeed)
        .value();

    return { availableCrafters, onSelect };
}

interface PickerState {
    readonly open: boolean;
    readonly anchorEl?: HTMLElement;
}

const styles: StyleRules = {
    container: {
        display: 'inline-flex'
    }
};

class InnerComponent extends React.Component<InnerProps & WithStyles, PickerState> {

    constructor(props: InnerProps & WithStyles) {
        super(props);
        this.state = { open: false };
    }

    toggleMenu(open: boolean, anchorEl?: HTMLElement) {
        this.setState({ open, anchorEl });
    }

    handleSelectCrafter(crafter: Crafter) {
        this.setState({ open: false });
        this.props.onSelect({
            ...crafter,
            count: 1,
            modules: Repeat(null, crafter.moduleSlots).toList()
        });
    }

    render() {
        const { availableCrafters, classes } = this.props;
        const { open, anchorEl } = this.state;

        return (
            <div className={classes.container}>
                <Button onClick={(e: SyntheticEvent<HTMLElement>) => this.toggleMenu(!open, e.currentTarget)}>
                    Add crafter...
                </Button>
                <Menu
                    open={open}
                    anchorEl={anchorEl}
                    onRequestClose={() => this.toggleMenu(false)}
                >
                    {
                        _.map(availableCrafters, crafter => (
                            <MenuItem onClick={() => this.handleSelectCrafter(crafter)} key={crafter.name}>
                                <ItemIcon {...crafter} />
                            </MenuItem>
                        ))
                    }
                </Menu>
            </div>
        );
    }
}

export default connect(mapStateToProps)(withStyles(styles)(InnerComponent));
