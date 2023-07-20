import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { logger } from "#util";

const currDirName = dirname(fileURLToPath(import.meta.url));

/**
 * creates a storage.
 */
export class StorageProvider {
  /**
     * creates a file and stores data in it.
     * @param {string} [fileName = "db.json"] filename to be used to store the logs.
     */
  constructor(fileName = "db.json") {
    this.file = join(currDirName, fileName);
    this.adapter = new JSONFile(this.file);
    this.defaultData = { logs: [] };
    this.db = new Low(this.adapter, this.defaultData);
    const setLogs = () => {
      this.logs = this.db.data.logs;
      logger.info("storage file set and ready to use");
    };
    this.db.read().then(() => setLogs());
  }

  /**
     * pass the log to be stored in the database.
     * @param {json} log - object you want to store.
     *
     * @example
     * write({
     * "level": "error",
     * "message": "something went wrong",
     * "timestamp": "23-05-2023 02:38:47.807 AM"})
     */
  write(log) {
    if (!this.logs) throw new Error("DB not yet set");
    this.logs.push(log);
    this.db.write();
  }

  /**
     * reads all the contents from the databse
     *
     * @returns {Array} [{"level": str, "message": str, "timestamp": str, ...}]
     */
  read() {
    return this.logs;
  }
}
