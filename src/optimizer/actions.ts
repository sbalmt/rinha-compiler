export type PostActionCallback = () => void;

let allPostActions: PostActionCallback[] = [];

export const registerPostAction = (action: PostActionCallback): void => {
  allPostActions.push(action);
};

export const performPostActions = (): void => {
  for (const action of allPostActions) {
    action();
  }
  allPostActions = [];
};
