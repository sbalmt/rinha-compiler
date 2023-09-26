import * as Core from '@xcheme/core';

import { VarValueType } from '../evaluator/scope';
import { Metadata } from '../core/metadata';
import { Scope } from './scope';

export type AstConsumer = (scope: Scope, node: Core.Node<Metadata>) => VarValueType<Metadata>;
