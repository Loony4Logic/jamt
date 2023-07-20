import { StorageProvider } from "#storage/storageProvider";
import { asyncPlaceholders } from "#util";

const storage = new StorageProvider(); // eslint-disable-line no-unused-vars
// as storage setup takes time and async can't be used
await asyncPlaceholders("sleep", 500);

function home(req, res) {
  res.json({ res: "Server Working" });
}

function logSender(req, res) {
  const logs = storage.read();
  res.json({ data: logs, meta: { message: "Logs sent", count: logs.length } });
}

export default { home, logSender };
