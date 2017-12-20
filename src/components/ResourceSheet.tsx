import ListComponent, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import { StyleRules, withStyles } from 'material-ui/styles';
import { WithStyles } from 'material-ui/styles/withStyles';
import * as React from 'react';

import { formatRate } from '../math/rates';
import { DetailedInvoice } from '../types/props';

import ItemIcon from './ItemIcon';

export interface ResourceSheetProps {
    readonly invoice: DetailedInvoice;
}

const styles: StyleRules = {

};

interface ResourceSheetState {
}

class ResourceSheet extends React.Component<ResourceSheetProps & WithStyles, ResourceSheetState> {

    constructor(props: ResourceSheetProps & WithStyles) {
        super(props);
        this.state = { };
    }

    render() {
        const { invoice } = this.props;

        const invoiceListItems = invoice.map(item => {
            const { name, description, rate } = item;
            return (
                <ListItem button key={name}>
                    <ListItemAvatar>
                        <ItemIcon {...item}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={description}
                        secondary={`Rate: ${formatRate(rate)}`}
                    />
                </ListItem>
            );
        });

        return <ListComponent>{invoiceListItems}</ListComponent>;
    }
}

export default withStyles(styles)(ResourceSheet);
