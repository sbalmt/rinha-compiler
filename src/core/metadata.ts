import { Scope, VarValueType } from '../evaluator/scope';

export type Metadata = {
  token: never;

  record: {
    references: number;
  };

  node: {
    pure?: boolean;
    recursive?: boolean;
    value?: VarValueType<Metadata> | Scope<Metadata>;
  };
};
