import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<Map<string, any>>();

export function getRequestId(): string | undefined {
  return requestContext.getStore()?.get('requestId') as string | undefined;
}
