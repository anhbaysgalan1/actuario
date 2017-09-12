/* eslint-disable global-require,import/no-dynamic-require */

import React from 'react';
import PropTypes from 'prop-types';

export default function ItemIcon({ name, description }) {
  const icon = require(`../icons/${name}.png`);
  return <img src={icon} alt={description} className="item-icon" />;
}

ItemIcon.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};