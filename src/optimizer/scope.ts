export class Scope {
  private scopeName: string;

  pure = true;

  assigning = false;

  recursive = false;

  constructor(name: string) {
    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
