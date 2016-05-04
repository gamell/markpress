'use strict';

const util = require('./util');

const increments = Object.freeze({
  x: 2600,
  y: 1400,
  z: 2000,
  scale: 1,
  rotate: 60,
  'rotate-x': 60,
  'rotate-y': 60,
  'rotate-z': 60,
});

const layout = {
  i: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  rotate: 0,
  'rotate-x': 0,
  'rotate-y': 0,
  'rotate-z': 0,
  grid: [{ x: 0, y: 0, direction: undefined }],
};

function random(params) {
  // how many parameters we will randomize
  const numOfParams = util.getRandomInt(1, params.length);
  const res = [];
  for (let i = 0; i < numOfParams; i++) {
    // remove 1 elem from index n
    const param = params.splice(util.getRandomInt(0, params.lenght - 1), 1)[0];
    const multiplier = util.getRandomInt(-3, 3);
    let newValue = layout[param] + (multiplier * increments[param]);
    if (param.indexOf('rotate') > -1) newValue = newValue % 360;
    if (param === 'scale') newValue = Math.max(newValue, 1);
    layout[param] = newValue;
    res.push({ key: param, value: newValue });
  }
  return res;
}


const random7d = () => random(['x', 'y', 'z', 'scale', 'rotate-x', 'rotate-y', 'rotate-z']);

const randomSimple = () => random(['x', 'y', 'z', 'scale', 'rotate']);

function generateNewCoord(lastCoord) {
  let direction = util.getRandomInt(0, 2); // what direction to move to
  // we check if the current direction is opposite to last direction, in which case we add one
  direction = (direction % 2 === lastCoord.direction % 2) ? ((direction + 1) % 2) : direction;
  const newCoord = { x: lastCoord.x, y: lastCoord.y, direction };
  switch (direction) {
    case 0:
      newCoord.y++;
      break;
    case 1:
      newCoord.x++;
      break;
    case 2:
      newCoord.y--;
      break;
    default: break;
  }
  return newCoord;
}

function grid() {
  const lastCoord = layout.grid[layout.grid.length - 1];
  const nextCoord = generateNewCoord(lastCoord);
  if (layout.grid.indexOf(nextCoord) > -1) {
    return grid();
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
  random: randomSimple,
  'random-7d': random7d,
  grid,
  horizontal() {
    layout.x += increments.x;
    return [{ key: 'x', value: layout.x }];
  },
  vertical() {
    layout.y += increments.y;
    return [{ key: 'y', value: layout.y }];
  },
  '3d-push': () => {
    layout.z += increments.z * 3;
    return [{ key: 'z', value: layout.z }];
  },
  '3d-pull': () => {
    layout.z -= increments.z * 3;
    return [{ key: 'z', value: layout.z }];
  },
};
