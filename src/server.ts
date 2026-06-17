import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`Server started on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down server.`);
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
