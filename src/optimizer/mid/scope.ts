import { BaseScope, BaseScopeOptions } from '../../core/scope';

export const enum ScopeTypes {
  BLOCK = 0x00,
  ASSIGNMENT,
  COMPARISON,
  ARITHMETIC
}

export class Scope extends BaseScope {
  private scopeName: string;

  type = ScopeTypes.BLOCK;

  pure = true;

  recursive = false;

  lazy = false;

  constructor(name: string, options?: BaseScopeOptions) {
    super(options);

    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
