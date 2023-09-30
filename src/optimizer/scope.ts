import * as Core from '@xcheme/core';

import { BaseScope, BaseScopeOptions } from '../core/scope';
import { NodeType } from '../core/types';

export type ScopeOptions = BaseScopeOptions & {
  enableHoisting?: boolean;
  constantFolding?: boolean;
  constantPropagation?: boolean;
  enableTailCall?: boolean;
};

export class Scope extends BaseScope {
  anchorNode: NodeType;

  anchorDirection: Core.NodeDirection;

  previousNode: NodeType;

  previousDirection: Core.NodeDirection;

  currentNode: NodeType;

  declarationNode?: NodeType;

  closureDeclarationNode?: NodeType;

  pending: boolean;

  constructor(anchorNode: NodeType, anchorDirection: Core.NodeDirection, parentScope?: Scope, options?: ScopeOptions) {
    super(parentScope, {
      enableHoisting: true,
      constantPropagation: true,
      constantFolding: true,
      enableTailCall: true,
      ...(options ?? parentScope?.options)
    });

    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;
    this.declarationNode = parentScope?.declarationNode;
    this.closureDeclarationNode = parentScope?.closureDeclarationNode;
    this.pending = parentScope?.pending ?? false;
  }

  get options(): ScopeOptions {
    return super.options as ScopeOptions;
  }

  isMatchingDeclaration(node: NodeType) {
    return this.declarationNode?.fragment.data === node.fragment.data;
  }

  isMatchingClosureDeclaration(node: NodeType) {
    return this.closureDeclarationNode?.fragment.data === node.fragment.data;
  }
}
