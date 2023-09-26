export type BaseScopeOptions = {
  debug?: boolean;
};

export class BaseScope {
  private scopeOptions: BaseScopeOptions;

  constructor(options?: BaseScopeOptions) {
    this.scopeOptions = {
      debug: false,
      ...options
    };
  }

  get options() {
    return this.scopeOptions;
  }
}
