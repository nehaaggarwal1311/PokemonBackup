const { MongoClient } = require("mongodb");
const { constants } = require("../config/constants")

const BACKUP_DB_URL = constants.BACKUP_DB_URL

const getDbClient = () => {
	return new MongoClient(BACKUP_DB_URL);
}

module.exports = {
	getDbClient
}

