import app from "./app";
import http from "http";
import config from "./config/config";

const logger = console;

const gracefulShutdown = (server: http.Server, forcedTimeout: number) => {
    return function () {
        logger.info("Received SIGINT or SIGTERM. Shutting down gracefully...");
        server.close(async () => {
            logger.info("Closed out remaining connections.");

            try {
                process.exit();
            } catch (err) {
                process.exit();
            }
        });
        
        setTimeout(() => {
            logger.error("Could not close connections in time, forcefully shutting down");
            process.exit();
        }, forcedTimeout);
    };
};


const server = http.createServer(app);

process.on("SIGTERM", gracefulShutdown(server, config.APP_FORCE_SHUTDOWN_SECOND));
process.on("SIGINT", gracefulShutdown(server, config.APP_FORCE_SHUTDOWN_SECOND));


(async () => {
    try {
        server.listen(config.APPLICATION_SERVER_PORT, () => {
            logger.log("Notification server running on " + config.APPLICATION_SERVER_PORT);
        });
    } catch (err) {
        console.error("Unable to connect", err);
    }
})();
