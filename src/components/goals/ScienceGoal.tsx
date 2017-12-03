import * as React from 'react';
import * as _ from 'lodash';
import { Switch } from 'material-ui';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import { FormControlLabel } from 'material-ui/Form';
import { withStyles, StyleRules } from 'material-ui/styles';

import ItemIcon from '../ItemIcon';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Action } from 'redux-act';
import { Goals, ProductionManifest } from '../../types/state';
import { RecipeCrafter, RecipeModule } from '../../actions/user/goals';

const styles: StyleRules = {
  title: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  enabledContents: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
  },

  disabledContents: {
    display: 'none',
  },

  packSwitchContainer: {
    flex: '1 1 300px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    justifyItems: 'center',
  },
};

const ScienceGoal: React.SFC<ScienceGoalProps & WithStyles> = ({ classes, ...moreProps }) => {
  const { enabled, /* sciencePacks, */ packDescriptions } = moreProps;
  const { toggleGoal, /* addCrafter, subtractCrafter, addModule, subtractModule */ } = moreProps;

  const enabledSwitch = <Switch checked={enabled} onChange={() => toggleGoal()} />;

  const cardTitle = (
    <div className={classes.title}>
      <span>Science</span>
      <FormControlLabel control={enabledSwitch} label="Enabled" />
    </div>
  );

  const packSwitches = _.map(
    packDescriptions,
    (packDescription, packName) => (
      <FormControlLabel
        control={<Switch checked={false} />}
        label={<ItemIcon name={packName} description={packDescription} />}
        key={packName}
      />
    ));

  return (
    <Card>
      <CardHeader title={cardTitle} />
      <CardContent className={enabled ? classes.enabledContents : classes.disabledContents}>
        <div className={classes.packSwitchContainer}>{packSwitches}</div>
      </CardContent>
    </Card>
  );
};

interface ScienceGoalProps {
  readonly enabled: boolean;
  readonly sciencePacks: ProductionManifest;
  readonly packDescriptions: { [name: string]: string };
  readonly toggleGoal: () => Action<keyof Goals>;
  readonly addCrafter: (packName: string, crafterName: string) => Action<RecipeCrafter>;
  readonly subtractCrafter: (packName: string, crafterName: string) => Action<RecipeCrafter>;
  readonly addModule: (packName: string, moduleName: string) => Action<RecipeModule>;
  readonly subtractModule: (packName: string, moduleName: string) => Action<RecipeModule>;
}

export default withStyles(styles)(ScienceGoal);
