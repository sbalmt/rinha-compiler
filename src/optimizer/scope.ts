export type Scope = {
  recursive: boolean;
  parent?: Scope;
  name: string;
};

export const createScope = (name: string, parent?: Scope) => {
  return {
    recursive: false,
    parent,
    name
  };
};
