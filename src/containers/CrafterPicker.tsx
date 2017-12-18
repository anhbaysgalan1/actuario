import { Repeat } from 'immutable';
import * as _ from 'lodash';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import * as React from 'react';
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
    const availableCrafters = _.filter(
        state.data.factorio.crafters,
        c => _.includes(c.craftingCategories, recipeCategory));

    return { availableCrafters, onSelect };
}

interface PickerState { readonly open: boolean; }

class InnerComponent extends React.Component<InnerProps, PickerState> {

    constructor(props: InnerProps) {
        super(props);
        this.state = { open: false };
    }

    toggleMenu(open: boolean) {
        this.setState({ open });
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
        const { availableCrafters } = this.props;
        const { open } = this.state;

        return (
            <div>
                <Button onClick={() => this.toggleMenu(!open)}>Add crafter...</Button>
                <Menu
                    open={open}
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

export default connect(mapStateToProps)(InnerComponent);
