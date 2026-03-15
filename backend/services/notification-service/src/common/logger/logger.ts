import pino from 'pino';
import { getRequestId } from '../request-context';

const baseLogger = pino({
  level: 'info',
  base: {
    service: 'auth-service',
  },
});

export const logger = {
  info(data: any) {
    baseLogger.info({
      requestId: getRequestId(),
      ...data,
    });
  },

  error(data: any) {
    baseLogger.error({
      requestId: getRequestId(),
      ...data,
    });
  },
};
