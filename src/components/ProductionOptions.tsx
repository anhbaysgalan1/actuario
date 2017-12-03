import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { ProductionOption } from '../types/state';

export interface ScienceGoalProps {
  readonly crafters: ProductionOption;
  readonly modules: ProductionOption;
}

const styles: StyleRules = {

};

const ProductionOptions: React.SFC<ScienceGoalProps & WithStyles> = ({ classes, ...moreProps }) => {

};

export default withStyles(styles)(ProductionOptions);
