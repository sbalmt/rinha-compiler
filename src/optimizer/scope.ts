export const enum ScopeTypes {
  BLOCK = 0x00,
  ASSIGNMENT,
  COMPARISON,
  ARITHMETIC
}

export class Scope {
  private scopeName: string;

  type = ScopeTypes.BLOCK;

  pure = true;

  recursive = false;

  lazy = false;

  constructor(name: string) {
    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
