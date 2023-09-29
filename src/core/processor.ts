import { ValueTypes } from './types';

const isIterable = (value: ValueTypes): value is Generator<ValueTypes> => {
  return value instanceof Object && (value as any).next instanceof Function;
};

export const iterateAllOver = (entry: ValueTypes): ValueTypes => {
  const stack = [entry] as Generator<ValueTypes>[];

  let result;

  for (let current; (current = stack[stack.length - 1]); ) {
    const { value, done } = current.next(result);

    if (isIterable(value)) {
      if (done) {
        stack[stack.length - 1] = value;
      } else {
        stack.push(value);
      }
    } else if (done) {
      stack.pop();
    }

    result = value;
  }

  return result;
};
