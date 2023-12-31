import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders, logger } from "#util";

/**
 * Client class to track web client details to send live data. 
 */
class Client{
  /**
   * setting inital parameters 
   * @param {Express.Response} response response object of web client to send live data.  
   */
  constructor(response){
    this.response = response;
  }

  /**
   * This method is used to send data to web client
   * @param {string} data data to be sent to web client 
   */
  send(data){
    this.response.write(`data: ${data}\n\n`);
  }
}

/**
 * This class will be used to handle client operations.
 */
class ConnectionManager{
  /**
   * initiates empty map of clients.
   */
  constructor(){
    this.clients = {};
  }

  /**
   * adds web client to list of clients. returns id. 
   * @param {Express.Response} response response object of web client  
   * @returns `string` this is id of client given by connection manager  
   */
  addClient(response){
    const id = Date.now(); 
    this.clients[id]  = new Client(response)
    return id;
  }

  /**
   * Remove client from list of clients 
   * @param {string} id client id generated while adding    
   */
  removeClient(id){
    this.clients[id] = null;
  }

  /**
   * use to broadcast data to all active web clients
   * @param {string} data data to be send to web client 
   */
  sendToAll(data){
    Object.values(this.clients).forEach(client => client.send(data));
  }
}

const storage = new StorageProvider(); // eslint-disable-line no-unused-vars
// as storage setup takes time and async can't be used
await asyncPlaceholders("sleep", 1500);
const connectionManager = new ConnectionManager();

/**
 * @api {get} api/ Retrieve Home Information
 * @apiName GetIndex
 * @apiGroup Index
 *
 * @apiSuccess {String} res server 
 */
function home(req, res) {
  res.json({ res: "Server Working" });
}

/**
 * @api {get} api/logs Log sender(serverSideEvent)
 * @apiName logSender
 * @apiGroup logs
 * 
 * @apiSuccess {Object[]} data List of logs
 * @apiSuccess {String} data.message Log Message
 * @apiSuccess {String} data.level Log level
 * @apiSuccess {String} data.timestamp Timestamp of log generated
 *  
 */
async function logSender(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  const id = connectionManager.addClient(res);

  res.on("close", ()=>connectionManager.removeClient(id));
}

/**
 * @api {post} api/listener Log listener 
 * @apiName logCapturer
 * @apiGroup logs
 * 
 * @apiBody {Object} log Log you need to record
 * @apiBody {Timestamp} log.timestamp Time stamp of log generation
 * @apiBody {String} log.message Log message to be recorded
 * @apiBody {String} log.level Level of log. can be any arbitary string. It is used for grouping logs 
 * 
 * @apiSuccess {String="log recorded", error message} meta.message Log recoded
 */
async function listener(req, res) {
  try {
    const log = req.body;
    await storage.write(log);
    connectionManager.sendToAll(JSON.stringify(log));
    res.json({ data: [], meta: { message: "log recorded" } });
  } catch (err) {
    res.json({ data: [], meta: { message: err.message } });
    logger.error("Error while reciving log: ", err);
  }
}

export default { home, listener, logSender };
