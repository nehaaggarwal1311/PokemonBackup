const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { constants } = require("./config/constants")
// Controllers
const backupsController = require("./routes/backups")

const app = express()
const PORT = constants.API_SERVER_PORT;

// Midddlewares
app.use(cors({
	origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

// Map routes to controllers
app.use("/backups", backupsController)

app.listen(PORT, () => {
	console.log(`API Server started on port`, PORT);
});