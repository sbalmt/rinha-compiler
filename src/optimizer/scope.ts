import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { BaseScope, BaseScopeOptions } from '../core/scope';

export class Scope extends BaseScope {
  anchorNode: Core.Node<Metadata>;

  anchorDirection: Core.NodeDirection;

  previousNode: Core.Node<Metadata>;

  previousDirection: Core.NodeDirection;

  currentNode: Core.Node<Metadata>;

  constructor(anchorNode: Core.Node<Metadata>, anchorDirection: Core.NodeDirection, options?: BaseScopeOptions) {
    super(options);

    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;
  }
}
