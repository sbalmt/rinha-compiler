import * as Core from '@xcheme/core';
import { Metadata } from '../../core/metadata';

export type Optimizations = {
  enableHoisting?: boolean;
  removeDeadCode?: boolean;
};

export class Scope {
  private scopeOptimizations: Optimizations;

  anchorNode: Core.Node<Metadata>;

  anchorDirection: Core.NodeDirection;

  previousNode: Core.Node<Metadata>;

  previousDirection: Core.NodeDirection;

  currentNode: Core.Node<Metadata>;

  constructor(anchorNode: Core.Node<Metadata>, anchorDirection: Core.NodeDirection, optimizations?: Optimizations) {
    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;
    this.scopeOptimizations = {
      ...optimizations
    };
  }

  get optimizations() {
    return this.scopeOptimizations;
  }
}
