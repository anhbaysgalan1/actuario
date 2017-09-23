import React from 'react';
import PropTypes from 'prop-types';
import { Paper, FormGroup, FormControlLabel, Switch, TextField } from 'material-ui';

import ItemIcon from './ItemIcon';

export function ScienceGoalSheet(props) {
  const { enabled, packsPerMin, enabledPacks, allPacks } = props;
  const { toggleEnabled, setPackRate, togglePack } = props;

  const rateField = (
    <TextField
      type="number"
      value={packsPerMin}
      onChange={({ target: { value } }) => setPackRate(value)}
    />
  );

  return (
    <Paper id="goal-science" className="goal-sheet">
      Hello
    </Paper>
  );
}

/*
ScienceGoalSheet.propTypes = {
  enabled: PropTypes.bool.isRequired,
  packsPerMin: PropTypes.number.isRequired,
  enabledPacks: PropTypes.arrayOf(PropTypes.string).isRequired,
  allPacks: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleEnabled: PropTypes.func.isRequired,
  setPackRate: PropTypes.func.isRequired,
  togglePack: PropTypes.func.isRequired,
};
*/

export function RocketGoalSheet(props) {
  const { enabled, rocketsPerHour } = props;
  const { toggleEnabled, setRocketRate } = props;

  return (
    <Paper id="goal-rocket" className="goal-sheet">
      Hello
    </Paper>
  );
}

/*
ScienceGoalSheet.propTypes = {
  enabled: PropTypes.bool.isRequired,
  rocketsPerHour: PropTypes.number.isRequired,
  toggleEnabled: PropTypes.func.isRequired,
  setRocketRate: PropTypes.func.isRequired,
};
*/

export function CustomGoalSheet(props) {
  const { enabled, recipeRates } = props;
  const { toggleEnabled, setRecipeRate, removeRecipe } = props;

  return (
    <Paper id="goal-custom" className="goal-sheet">
      Hello
    </Paper>
  );
}

/*
ScienceGoalSheet.propTypes = {
  enabled: PropTypes.bool.isRequired,
  recipeRates: PropTypes.objectOf(PropTypes.number).isRequired,
  toggleEnabled: PropTypes.func.isRequired,
  setRecipeRate: PropTypes.func.isRequired,
  removeRecipe: PropTypes.func.isRequired,
};
*/
