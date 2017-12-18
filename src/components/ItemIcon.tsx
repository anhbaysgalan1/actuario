import * as React from 'react';

export interface ItemIconProps {
  readonly name: string;
  readonly description: string;
}

const ItemIcon: React.SFC<ItemIconProps> = ({ name, description }) => {
  const icon = require(`../icons/${name}.png`);
  return <img src={icon} alt={description} className="item-icon" />;
};

export default ItemIcon;
