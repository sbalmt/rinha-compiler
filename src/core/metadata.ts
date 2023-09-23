import { Scope, VarValueType } from '../evaluator/scope';

export type Metadata = {
  token: never;

  record: {
    mutable: boolean;
    references: number;
  };

  node: {
    pure?: boolean;
    recursive?: boolean;
    parameters?: number;
    lazy?: boolean;
    value?: VarValueType<Metadata> | Scope<Metadata>;
  };
};
