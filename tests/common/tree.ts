import { NodeTypes } from '../../src/core/types';

import { Tree } from './assertions';

export const getExpressionTree = (expressionNode: Tree) => {
  return {
    kind: NodeTypes.EXPRESSION,
    right: expressionNode
  };
};

export const getVariableTree = (identifier: string, expressionNode: Tree) => {
  return {
    kind: NodeTypes.VARIABLE,
    right: {
      kind: NodeTypes.IDENTIFIER,
      fragment: identifier,
      right: expressionNode
    }
  };
};

export const getConditionTree = (conditionNode: Tree, successNode: Tree, failureNode?: Tree) => {
  return {
    kind: NodeTypes.IF_ELSE,
    right: {
      kind: NodeTypes.CONDITION,
      right: conditionNode,
      next: {
        kind: NodeTypes.BLOCK,
        right: successNode,
        next: failureNode && {
          kind: NodeTypes.BLOCK,
          right: failureNode
        }
      }
    }
  };
};

export const getClosureTree = (bodyNode: Tree, parametersNode?: Tree) => {
  return {
    kind: NodeTypes.CLOSURE,
    right: {
      kind: NodeTypes.BLOCK,
      right: parametersNode,
      next: {
        kind: NodeTypes.BLOCK,
        right: bodyNode
      }
    }
  };
};

export const getClosureParametersTree = (first: string, ...remaining: string[]) => {
  const parameterTree: Tree = {
    kind: NodeTypes.PARAMETER,
    fragment: first
  };

  for (let current = parameterTree, index = 0; index < remaining.length; ++index) {
    current = current.next = {
      kind: NodeTypes.PARAMETER,
      fragment: remaining[index]
    };
  }

  return parameterTree;
};

export const getTernaryTree = (conditionNode: Tree, successNode: Tree, failureNode: Tree) => {
  return {
    kind: NodeTypes.TERNARY,
    right: {
      kind: NodeTypes.CONDITION,
      right: conditionNode,
      next: {
        kind: NodeTypes.BLOCK,
        right: successNode,
        next: {
          kind: NodeTypes.BLOCK,
          right: failureNode
        }
      }
    }
  };
};

export const getAssignmentTree = (identifier: string, rhsNode: Tree) => {
  return {
    kind: NodeTypes.ASSIGNMENT,
    fragment: '=',
    left: {
      kind: NodeTypes.IDENTIFIER,
      fragment: identifier
    },
    right: rhsNode
  };
};

export const getLogicalOrTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.LOGICAL_OR,
    fragment: '||',
    left: lhsNode,
    right: rhsNode
  };
};

export const getLogicalAndTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.LOGICAL_AND,
    fragment: '&&',
    left: lhsNode,
    right: rhsNode
  };
};

export const getEqualTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.EQUAL,
    fragment: '==',
    left: lhsNode,
    right: rhsNode
  };
};

export const getNotEqualTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.NOT_EQUAL,
    fragment: '!=',
    left: lhsNode,
    right: rhsNode
  };
};

export const getGreaterThanTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.GREATER_THAN,
    fragment: '>',
    left: lhsNode,
    right: rhsNode
  };
};

export const getLessThanTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.LESS_THAN,
    fragment: '<',
    left: lhsNode,
    right: rhsNode
  };
};

export const getGreaterThanOrEqualTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.GREATER_THAN_OR_EQUAL,
    fragment: '>=',
    left: lhsNode,
    right: rhsNode
  };
};

export const getLessThanOrEqualTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.LESS_THAN_OR_EQUAL,
    fragment: '<=',
    left: lhsNode,
    right: rhsNode
  };
};

export const getAdditionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.ADD,
    fragment: '+',
    left: lhsNode,
    right: rhsNode
  };
};

export const getSubtractionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.SUBTRACT,
    fragment: '-',
    left: lhsNode,
    right: rhsNode
  };
};

export const getMultiplicationTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.MULTIPLY,
    fragment: '*',
    left: lhsNode,
    right: rhsNode
  };
};

export const getDivisionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.DIVIDE,
    fragment: '/',
    left: lhsNode,
    right: rhsNode
  };
};

export const getModuloTree = (lhsNode: Tree, rhsNode: Tree) => {
  return {
    kind: NodeTypes.MODULO,
    fragment: '%',
    left: lhsNode,
    right: rhsNode
  };
};

export const getInvocationTree = (callee: Tree, argumentsNode?: Tree) => {
  return {
    kind: NodeTypes.INVOKE,
    left: {
      ...callee,
      next: argumentsNode
    }
  };
};

export const getLogicalAndExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getLogicalAndTree(lhsNode, rhsNode));
};

export const getLogicalOrExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getLogicalOrTree(lhsNode, rhsNode));
};

export const getEqualExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getEqualTree(lhsNode, rhsNode));
};

export const getNotEqualExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getNotEqualTree(lhsNode, rhsNode));
};

export const getGreaterThanExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getGreaterThanTree(lhsNode, rhsNode));
};

export const getLessThanExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getLessThanTree(lhsNode, rhsNode));
};

export const getGreaterThanOrEqualExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getGreaterThanOrEqualTree(lhsNode, rhsNode));
};

export const getLessThanOrEqualExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getLessThanOrEqualTree(lhsNode, rhsNode));
};

export const getAddExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getAdditionTree(lhsNode, rhsNode));
};

export const getSubExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getSubtractionTree(lhsNode, rhsNode));
};

export const getMultiplyExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getMultiplicationTree(lhsNode, rhsNode));
};

export const getDivideExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getDivisionTree(lhsNode, rhsNode));
};

export const getModuloExpressionTree = (lhsNode: Tree, rhsNode: Tree) => {
  return getExpressionTree(getModuloTree(lhsNode, rhsNode));
};
