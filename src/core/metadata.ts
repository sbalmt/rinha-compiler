import { Scope, VarValueType } from '../evaluator/scope';

export type Metadata = {
  token: never;

  record: never;

  node: {
    value?: VarValueType<Metadata> | Scope<Metadata>;
  };
};
