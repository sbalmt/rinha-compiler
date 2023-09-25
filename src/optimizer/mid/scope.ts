import { BaseScope, BaseScopeOptions } from '../../core/scope';

export class Scope extends BaseScope {
  private scopeName: string;

  pure = true;

  constructor(name: string, options?: BaseScopeOptions) {
    super(options);

    this.scopeName = name;
  }

  get name() {
    return this.scopeName;
  }
}
