import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { ValueTypes } from '../core/types';
import { Scope } from './scope';

export type AstConsumer = (scope: Scope, node: Core.Node<Metadata>) => ValueTypes;
