import { logLevel } from "#constant";
import "winston-daily-rotate-file";
import winston from "winston";
import dotenv from "dotenv";

const {
  combine, timestamp, align, printf, colorize, json,
} = winston.format;

dotenv.config();

/**
 *
 * a placeholder to substitude some actual function for fast dev purpose.
 *
 * @param {*} data any data that you want as return from the function after mentioned time
 * @param {number} time in ms
 * @returns {Promise} promise that can act as placeholder
 *
 * @example
 * ()=>{asyncPlaceholder("hello", 1000).then(res=>console.log(res))}
 *
 * @example
 * async ()=>{let res = await asyncPlaceholder("hello", 1000); console.log(res)}
 */
export const asyncPlaceholders = (data, time) => new Promise((resolve) => {
  setTimeout(() => resolve(data), time);
});

/**
 * corn job
 * var cron = require('node-cron');
 * cron.schedule('* * * * *', () => {
 *      console.log('running a task every minute');
 * });
 */

const logFileTransport = new winston.transports.DailyRotateFile({
  level: logLevel[process.env.ENVIRONMENT] || "info",
  filename: `./logs/application-${process.env.ENVIRONMENT}-%DATE%.log`,
  handleExceptions: true,
  json: true,
  colorize: false,
  format: combine(
    timestamp({
      format: "DD-MM-YYYY hh:mm:ss.SSS A",
    }),
    json(),
  ),
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

export const logger = winston.createLogger({
  transports: [
    logFileTransport,
    new winston.transports.Console({
      level: logLevel[process.env.ENVIRONMENT] || "info",
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write(message) {
    logger.info(message.trim());
  },
};

export default {
  asyncPlaceholders,
  logger,
};
