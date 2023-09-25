export type BaseScopeOptions = {
  enableHoisting?: boolean;
  resolveLiterals?: boolean;
  removeDeadCode?: boolean;
};

export class BaseScope {
  private scopeOptions: BaseScopeOptions;

  constructor(options?: BaseScopeOptions) {
    this.scopeOptions = {
      enableHoisting: true,
      resolveLiterals: true,
      removeDeadCode: true,
      ...options
    };
  }

  get options() {
    return this.scopeOptions;
  }
}
