import * as Core from '@xcheme/core';
import { Metadata } from '../../core/metadata';

export class Scope {
  anchorNode: Core.Node<Metadata>;

  anchorDirection: Core.NodeDirection;

  previousNode: Core.Node<Metadata>;

  previousDirection: Core.NodeDirection;

  currentNode: Core.Node<Metadata>;

  constructor(
    anchorNode: Core.Node<Metadata>,
    anchorDirection: Core.NodeDirection,
    previousDirection = anchorDirection
  ) {
    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = previousDirection;
    this.previousNode = anchorNode;
    this.currentNode = this.previousNode.get(previousDirection)!;
  }
}
