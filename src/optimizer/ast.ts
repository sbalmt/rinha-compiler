import * as Core from '@xcheme/core';

import { NodeTypes } from '../core/types';

export const combineNodes = <T extends Core.Types>(
  first: Core.Node<T>,
  last: Core.Node<T>,
  value: NodeTypes
): Core.Node<T> => {
  const lineRange = new Core.Range(first.fragment.location.line.begin, last.fragment.location.line.end);
  const columnRange = new Core.Range(first.fragment.location.column.begin, last.fragment.location.column.end);

  const location = new Core.Location(first.fragment.location.name, lineRange, columnRange);
  const fragment = new Core.Fragment(first.fragment.source, first.fragment.begin, last.fragment.end, location);

  return new Core.Node(fragment, value, first.table);
};
