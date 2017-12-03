import * as React from 'react';

export default function ItemIcon({ name, description }: ItemIconProps) {
  const icon = require(`../icons/${name}.png`);
  return <img src={icon} alt={description} className="item-icon" />;
}

interface ItemIconProps {
  readonly name: string;
  readonly description: string;
}
