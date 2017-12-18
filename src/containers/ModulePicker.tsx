import * as _ from 'lodash';
import { Button, Icon, Menu, MenuItem } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';

import ItemIcon from '../components/ItemIcon';
import { Module } from '../types/factorio';
import { ActuarioState } from '../types/state';

export interface ModulePickerProps {
    readonly recipe: string;
    readonly selectedModule: Module | null;
    readonly onSelect: (newModule: Module | null) => void;
}

interface InnerProps {
    readonly availableModules: Module[];
    readonly selectedModule: Module | null;
    readonly onSelect: (newModule: Module | null) => void;
}

function mapStateToProps(state: ActuarioState, { recipe, selectedModule, onSelect }: ModulePickerProps): InnerProps {
    if (_.isNil(state.data.factorio))
        return { availableModules: [], selectedModule, onSelect };
    
    const availableModules = _.filter(
        state.data.factorio.modules,
        m => _.isEmpty(m.validRecipes) || _.includes(m.validRecipes, recipe));

    return { availableModules, selectedModule, onSelect };
}

interface PickerState { readonly open: boolean; }

class InnerComponent extends React.Component<InnerProps, PickerState> {

    constructor(props: InnerProps) {
        super(props);
        this.state = { open: false };
    }

    handleSelect(newModule: Module | null) {
        this.setState({ open: false });
        this.props.onSelect(newModule);
    }

    toggleMenu(open: boolean) {
        this.setState({ open });
    }

    render() {
        const { availableModules, selectedModule } = this.props;
        const { open } = this.state;

        const displayIcon = _.isNil(selectedModule)
            ? <Icon>add</Icon>
            : <ItemIcon {...selectedModule} />;

        return (
            <div>
                <Button onClick={() => this.toggleMenu(!open)}>{displayIcon}</Button>
                <Menu
                    open={open}
                    onRequestClose={() => this.toggleMenu(false)}
                >
                    {
                        _.map(availableModules, m => (
                            <MenuItem onClick={() => this.handleSelect(m)} key={m.name}>
                                <ItemIcon {...m} />
                            </MenuItem>
                        ))
                    }
                    <MenuItem onClick={() => this.handleSelect(null)} key="select-none">
                        <Icon>clear</Icon>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default connect(mapStateToProps)(InnerComponent);
