'use strict';

const util = require('./util');

const increments = Object.freeze({
  x: 2000,
  y: 1200,
  z: 4000,
  scale: 1,
  rotate: 45,
});

const layout = {
  i: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  rotate: 0,
};

function random() {
  const layoutParams = ['x', 'y', 'z', 'scale', 'rotate'];
  // how many parameters we will randomize
  const numOfParams = util.getRandomInt(1, layoutParams.length);
  const res = [];
  for (let i = 0; i < numOfParams; i++) {
    // remove 1 elem from index n
    const param = layoutParams.splice(util.getRandomInt(0, layoutParams.lenght - 1), 1)[0];
    const multiplier = util.getRandomInt(-3, 3);
    let newValue = layout[param] + (multiplier * increments[param]);
    if (param === 'rotation') newValue = newValue % 360;
    if (param === 'scale') newValue = Math.max(newValue, 1);
    layout[param] = newValue;
    res.push({ key: param, value: newValue });
  }
  return res;
}

module.exports = {
  random,
  horizontal() {
    layout.x += layout.x;
    return [{ key: 'x', value: layout.x }];
  },
  vertical() {
    layout.y += layout.y;
    return [{ key: 'y', value: layout.y }];
  },
  '3d-push': () => {
    layout.z += layout.z;
    return [{ key: 'z', value: layout.z }];
  },
  '3d-pull': () => {
    layout.z -= layout.z;
    return [{ key: 'z', value: layout.z }];
  },
};
