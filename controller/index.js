import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders, logger } from "#util";

const storage = new StorageProvider(); // eslint-disable-line no-unused-vars
// as storage setup takes time and async can't be used
await asyncPlaceholders("sleep", 500);


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
 * @api {get} api/logs log sender
 * @apiName logSender
 * @apiGroup logs
 * 
 * @apiParam {String} [q] query string used for filtering
 * 
 * @apiSuccess {Object[]} data List of logs
 * @apiSuccess {String} data.message Log Message
 * @apiSuccess {String} data.level Log level
 * @apiSuccess {String} data.timestamp Timestamp of log generated
 * @apiSuccess {Object} meta Meta data for logs
 * @apiSuccess {String="Logs sent"} meta.message message about logs 
 * @apiSuccess {Number} meta.count Count of logs 
 *  
 */
function logSender(req, res) {
  const { query } = req;
  let logs;
  if (query.q && query.q !== "") {
    logs = storage.filter(query.q);
  } else {
    logs = storage.read();
  }
  res.json({ data: logs, meta: { message: "Logs sent", count: logs.length } });
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
function listener(req, res) {
  try {
    const log = req.body;
    storage.write(log);
    res.json({ data: [], meta: { message: "log recorded" } });
  } catch (err) {
    res.json({ data: [], meta: { message: err.message } });
    logger.error("Error while reciving log: ", err);
  }
}

export default { home, listener, logSender };
