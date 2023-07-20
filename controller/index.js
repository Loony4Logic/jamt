import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders, logger } from "#util";

const storage = new StorageProvider(); // eslint-disable-line no-unused-vars
// as storage setup takes time and async can't be used
await asyncPlaceholders("sleep", 500);

function home(req, res) {
  res.json({ res: "Server Working" });
}

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

export default { home, listener };
