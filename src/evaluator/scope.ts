import { ValueTypes } from '../core/types';
import { BaseScope, BaseScopeOptions } from '../core/scope';

type VarMapType = {
  [identifier: string]: ValueTypes;
};

type VarRecordType = {
  identifier: string;
  value: ValueTypes;
};

export class Scope extends BaseScope {
  private variables: VarMapType = {};

  private parent: Scope | undefined;

  constructor(parent?: Scope, options?: BaseScopeOptions) {
    super(options);

    this.parent = parent;
  }

  createVariable(identifier: string, value: ValueTypes): void {
    this.variables[identifier] = value;
  }

  updateVariable(identifier: string, value: ValueTypes): ValueTypes {
    if (identifier in this.variables) {
      return (this.variables[identifier] = value);
    }

    if (this.parent) {
      return this.parent.updateVariable(identifier, value);
    }

    return value;
  }

  readVariable(identifier: string): ValueTypes {
    if (identifier in this.variables) {
      return this.variables[identifier];
    }

    if (this.parent) {
      return this.parent.readVariable(identifier);
    }

    return undefined;
  }

  *[Symbol.iterator](): Iterator<VarRecordType> {
    for (const identifier in this.variables) {
      yield {
        identifier,
        value: this.variables[identifier]
      };
    }
  }
}
