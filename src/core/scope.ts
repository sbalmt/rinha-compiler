export type BaseScopeOptions = {
  debug?: boolean;
  enableHoisting?: boolean;
  resolveReferences?: boolean;
  resolveLiterals?: boolean;
  removeDeadCode?: boolean;
};

export class BaseScope {
  private scopeOptions: BaseScopeOptions;

  constructor(options?: BaseScopeOptions) {
    this.scopeOptions = {
      enableHoisting: true,
      resolveReferences: true,
      resolveLiterals: true,
      removeDeadCode: true,
      ...options
    };
  }

  get options() {
    return this.scopeOptions;
  }
}
