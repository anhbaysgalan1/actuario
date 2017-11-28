import * as React from 'react';
import * as _ from 'lodash';
import { Switch, TextField } from 'material-ui';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import { FormControlLabel } from 'material-ui/Form';
import { withStyles, StyleRules } from 'material-ui/styles';

import ItemIcon from '../ItemIcon';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Action } from 'redux-act';
import { GoalsState } from '../../types/state';

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
  const { enabled, packsPerMin, enabledPacks, sciencePacks } = moreProps;
  const { toggleGoal, setPackRate, togglePackEnabled } = moreProps;

  const enabledSwitch = <Switch checked={enabled} onChange={() => toggleGoal()} />;

  const cardTitle = (
    <div className={classes.title}>
      <span>Science</span>
      <FormControlLabel control={enabledSwitch} label="Enabled" />
    </div>
  );

  const packSwitches = _.map(
    sciencePacks,
    (packDescription, packName) => (
      <FormControlLabel
        control={<Switch
          checked={_.includes(enabledPacks, packName)}
          onChange={() => togglePackEnabled(packName)}
        />}
        label={<ItemIcon name={packName} description={packDescription} />}
        key={packName}
      />
    ));

  return (
    <Card>
      <CardHeader title={cardTitle} />
      <CardContent className={enabled ? classes.enabledContents : classes.disabledContents}>
        <TextField
          disabled={!enabled}
          id="science-pack-rate"
          label="Pack Production Rate"
          value={packsPerMin}
          onChange={e => setPackRate(parseFloat(e.target.value))}
        />
        <div className={classes.packSwitchContainer}>{packSwitches}</div>
      </CardContent>
    </Card>
  );
};

interface ScienceGoalProps {
  readonly enabled: boolean;
  readonly packsPerMin: number;
  readonly enabledPacks: string[];
  readonly sciencePacks: { [name: string]: string };
  readonly toggleGoal: () => Action<keyof GoalsState>;
  readonly setPackRate: (rate: number) => Action<number>;
  readonly togglePackEnabled: (packName: string) => Action<string>;
}

export default withStyles(styles)(ScienceGoal);
