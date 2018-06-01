export const loggerMiddleware = store => next => action => {
  console.log('Action', action);
  let result = next(action);
  console.log('Store after', store.getState());
  return result;
}