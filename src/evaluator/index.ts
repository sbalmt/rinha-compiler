import * as Core from '@xcheme/core';

import * as Block from './nodes/block';

import { Metadata } from '../core/metadata';
import { BaseScopeOptions } from '../core/scope';
import { ValueTypes } from '../core/types';
import { applyBuiltIn } from './builtin';
import { Scope } from './scope';

const isIterable = (value: ValueTypes): value is Generator<ValueTypes> => {
  return value instanceof Object && (value as any).next instanceof Function;
};

export const consumeNodes = (node: Core.Node<Metadata>, options?: BaseScopeOptions) => {
  if (node.next) {
    const scope = new Scope(undefined, options);

    applyBuiltIn(scope, node.table);

    const stack = [Block.consumeNodes(scope, node.next)] as Generator<ValueTypes>[];
    let forward;

    for (let current; (current = stack[stack.length - 1]); ) {
      const { value, done } = current.next(forward);

      if (isIterable(value)) {
        if (done) {
          stack[stack.length - 1] = value;
        } else {
          stack.push(value);
        }
      } else if (done) {
        stack.pop();
      }

      forward = value;
    }
  }
};
