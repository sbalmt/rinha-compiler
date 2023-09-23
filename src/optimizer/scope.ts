export class Scope {
  private scopeName: string;

  pure = true;

  assignment = false;

  recursive = false;

  constructor(name: string) {
    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
