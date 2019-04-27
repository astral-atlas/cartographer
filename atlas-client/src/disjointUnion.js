// @flow

const func1 = (): [null, true] | [true, null] => {
  if (Math.random() > 0.5) {
    return [null, true];
  } else {
    return [true, null];
  }
};

const func2 = (): true => {
  const [val1, val2] = func1();
  if (val1) {
    return val1;
  } else {
    return val2;
  }
};
