'use strict';

const util = require('./util');

const increments = Object.freeze({
  x: 2000,
  y: 1200,
  z: 4000,
  scale: 1,
  rotate: 60,
});

const layout = {
  i: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  'rotate-x': 0,
  'rotate-y': 0,
  'rotate-z': 0,
  grid: [{ x: 0, y: 0 }],
};

function random() {
  const layoutParams = ['x', 'y', 'z', 'scale', 'rotate-x', 'rotate-y', 'rotate-z'];
  // how many parameters we will randomize
  const numOfParams = util.getRandomInt(1, layoutParams.length);
  const res = [];
  for (let i = 0; i < numOfParams; i++) {
    // remove 1 elem from index n
    const param = layoutParams.splice(util.getRandomInt(0, layoutParams.lenght - 1), 1)[0];
    const multiplier = util.getRandomInt(-3, 3);
    let newValue = layout[param] + (multiplier * increments[param]);
    if (param.indexOf('rotate') > -1) newValue = newValue % 360;
    if (param === 'scale') newValue = Math.max(newValue, 1);
    layout[param] = newValue;
    res.push({ key: param, value: newValue });
  }
  return res;
}

function generateNewCoord(lastCoord) {
  const direction = util.getRandomInt(1, 3); // what direction to move to
  const newCoord = { x: lastCoord.x, y: lastCoord.y };
  switch (direction) {
    case 1:
      newCoord.y++;
      break;
    case 2:
      newCoord.x++;
      break;
    case 3:
      newCoord.y--;
      break;
    default: break;
  }
  return newCoord;
}

function randomGrid() {
  const lastCoord = layout.grid[layout.grid.length - 1];
  const nextCoord = generateNewCoord(lastCoord);
  if (layout.grid.indexOf(nextCoord) > -1) {
    return randomGrid();
  }
  layout.grid.push(nextCoord);
  return [{
    key: 'x',
    value: nextCoord.x * increments.x,
  }, {
    key: 'y',
    value: nextCoord.y * increments.y,
  }];
}

module.exports = {
  random,
  horizontal() {
    layout.x += increments.x;
    return [{ key: 'x', value: layout.x }];
  },
  vertical() {
    layout.y += increments.y;
    return [{ key: 'y', value: layout.y }];
  },
  'random-grid': randomGrid,
  '3d-push': () => {
    layout.z += increments.z;
    return [{ key: 'z', value: layout.z }];
  },
  '3d-pull': () => {
    layout.z -= increments.z;
    return [{ key: 'z', value: layout.z }];
  },
};
