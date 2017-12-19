import * as _ from 'lodash';
import { Button, Icon, Menu, MenuItem } from 'material-ui';
import { StyleRules, WithStyles, withStyles } from 'material-ui/styles';
import * as React from 'react';
import { SyntheticEvent } from 'react';
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
    
    const availableModules = _(state.data.factorio.modules)
        .filter(m => _.isEmpty(m.validRecipes) || _.includes(m.validRecipes, recipe))
        .sortBy((m: Module) => m.tier)
        .sortBy((m: Module) => m.category)
        .value();

    return { availableModules, selectedModule, onSelect };
}

interface PickerState {
    readonly open: boolean;
    readonly anchorEl?: HTMLElement;
}

const styles: StyleRules = {
    container: {
        display: 'inline-flex'
    },
    button: {
        minWidth: 40,
        padding: 0
    }
};

class InnerComponent extends React.Component<InnerProps & WithStyles, PickerState> {

    constructor(props: InnerProps & WithStyles) {
        super(props);
        this.state = { open: false };
    }

    handleSelect(newModule: Module | null) {
        this.setState({ open: false });
        this.props.onSelect(newModule);
    }

    toggleMenu(open: boolean, anchorEl?: HTMLElement) {
        this.setState({ open, anchorEl });
    }

    render() {
        const { availableModules, selectedModule, classes } = this.props;
        const { open, anchorEl } = this.state;

        const displayIcon = _.isNil(selectedModule)
            ? <Icon>add_circle_outline</Icon>
            : <ItemIcon {...selectedModule} />;

        return (
            <div className={classes.container}>
                <Button
                    onClick={(e: SyntheticEvent<HTMLElement>) => this.toggleMenu(!open, e.currentTarget)}
                    className={classes.button}
                >
                    {displayIcon}
                </Button>
                <Menu
                    open={open}
                    anchorEl={anchorEl}
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

export default connect(mapStateToProps)(withStyles(styles)(InnerComponent));
