import http from 'http';
import debug from 'debug'; // ("api:server");
import app from '#app';
import { logger } from '#util';
import { readFile, writeFile } from 'fs';
import path, {dirname} from 'path';
import arg from 'arg';
import inquirer from 'inquirer';
import { fileURLToPath } from "url"
;
const currDirName = dirname(fileURLToPath(import.meta.url));


/**
 * Function to create http server from express app with given port.
 * Also to set port for frontend server
 *
 * @param {Number} serverPort port where application can send its log data
 * @param {Number} viewPort port where dashboard can be accessed
 */

function setupLogMonitor(serverPort) {
  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Get port from environment and store in Express.
   */

  const port = normalizePort(serverPort || '4545');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

}

/**
 * 
 * @param {Array<String>} rawArgs arguments recived from process 
 * @returns {{port: number, skipPrompts: boolean}} argumets recived as cli input to the process in object form 
 */
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '--port': Number,
      '-p': '--port',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    port: args['--port'],
  };
}

/**
 * 
 * @param {{port: number, skipPrompts: boolean}} options Options recived should be shared 
 * @returns {{port: number, skipPrompts: boolean}} arguments after processing and promting for missing inputs
 */
async function promptForMissingOptions(options) {
  if (options.skipPrompts) {
    return {
      ...options,
      port: 3000
    };
  }

  const questions = [];
  if (!options.port) {
    questions.push({
      type: 'number',
      name: 'port',
      message: 'Please choose which port you want to use for dashboard view',
      default: 3000,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    port: options.port || answers.port,
  };
}

/**
 * 
 * @param {Array<string>} args argumets revied to process as cli input
 * 
 * processes cli inputs and starts the server for monitoring and dashboard 
 */
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  setupLogMonitor(options.port);
  console.log("Monitoring server setup at "+ options.port)
  console.log(`For api docs go to: http://localhost:${options.port}/docs`)
  console.log(`For Monitoring dashboard go to: http://localhost:${options.port}/`)
}
