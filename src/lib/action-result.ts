export interface ActionState<T = undefined> {
  error?: string;
  data?: T;
  success?: string;
}
