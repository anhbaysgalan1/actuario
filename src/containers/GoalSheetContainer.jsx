import React from 'react';
import { connect } from 'react-redux';
import { Paper } from 'material-ui';

import { fetchGoals } from '../actions/data';
import { ScienceGoalSheet, RocketGoalSheet, CustomGoalSheet } from '../components/GoalSheets';

export default function GoalSheetContainer() {
  return (
    <Paper id="goals">
      <ScienceGoalSheet />
      <RocketGoalSheet />
      <CustomGoalSheet />
    </Paper>
  );
}
