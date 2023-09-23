export class Scope {
  private scopeName: string;

  recursive = false;

  constructor(name: string) {
    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
