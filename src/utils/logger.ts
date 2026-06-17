type LogPayload = unknown;

export const logger = {
  info(message: string, payload?: LogPayload) {
    if (payload === undefined) {
      console.info(message);
      return;
    }

    console.info(message, payload);
  },

  error(error: LogPayload) {
    console.error(error);
  }
};
