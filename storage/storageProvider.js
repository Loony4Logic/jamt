import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { logger } from '#util';

const currDirName = dirname(fileURLToPath(import.meta.url));


import { Sequelize, DataTypes, Op } from 'sequelize';

const LogStruct = {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  level: {
    type: DataTypes.TEXT,
  },
  message: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
};

export class StorageProvider {
  /**
   * creates a file and stores data in it.
   * @param {string} [fileName = "db.sqlite"] filename to be used to store the logs.
   */
  constructor(fileName = '0') {
    this.file = join(currDirName, `${fileName}-db.sqlite`);
    console.log(this.file);
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this.file,
    });
    this.Log = this.sequelize.define("Log", LogStruct);
    this.Log.sync();
    console.log("DB setup complted")
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
  async write(log) {
    if (!this.Log) throw new Error('DB not yet set');
    const newLog = await this.Log.create({
      timestamp: log.timestamp,
      level: log.level,
      message: log.message
    }) 
  }

  /**
   * reads all the contents from the databse
   *
   * @returns {Array} [{"level": str, "message": str, "timestamp": str, ...}]
   */
  async read() {
    const logs = await this.Log.findAll();
    return logs;
  }

  /**
   * returns all the logs that have filterText in one of the Keys
   *
   *
   * @param {string} filterText text by which you want to search all the logs
   * @returns {Array} Returns array of logs that have filter text
   */
  async filter(filterText) {
    let res = await this.Log.getAll({
      where:{
        [Op.substring]: filterText,
      }
    })

    return res;
  }

  /**
   * removes all the data from json.
   */
  async clear() {
    await this.Log.drop();
  }
}
