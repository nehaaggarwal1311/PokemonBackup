const express = require('express');
var router = express.Router({mergeParams: true});
const { getDbClient } = require("../utils/dbutils");
const { constants } = require("../config/constants");

const createBackup = async (req, res, next) => {
    const client = getDbClient();
    await client.connect();
    
	const db = await client.db(constants.DB_NAME);

	db.collection(constants.DB_COLLECTION_NAME).drop(function(err, delOK) {
		if (err) {
			console.log("drop error")
		}
		if (delOK) {
			console.log("Collection deleted");
	  }
	})

    db.collection(constants.DB_COLLECTION_NAME).insertMany(req.body.cards.map((card) => ({
		...card,
		hp: Number(card.hp)
	})))
    .then(function(result) {
      	return res.json({
			result
		});
    },(error) => {
      	return res.json({
		  error
		}); 
  })
};

const purgeBackup = async (req, res) => {
	const client = getDbClient();
    await client.connect();
    
	const db = await client.db(constants.DB_NAME);

	  db.collection(constants.DB_COLLECTION_NAME).drop(function(err, delOK) {
		if (err) {
			throw err;
			return res.json({
				err
			});
		}
		if (delOK) {
			return res.json({
				delOK
		});
	  }
	})
	  .then(function(result) {
		return res.json({
		  result
	  });
	},(error) => {
			return res.json({
			error
		}); 
	})
	  .catch((err) => {
		return res.json({
			err
		  }); 
	  });
}

const searchBackup = async (req, res) => {
	const params = [];

	const { hp, rarity, name, op } = req.query || {};
	Object.keys(req.query).map((key) => {
		if ("hp" == key && req.query[key]){
			params.push({hp: {[`$${op}`]: Number(req.query[key])}})
		} else if ("rarity" == key && req.query[key]){
			params.push({rarity: req.query[key]})
		} else if ("name" == key && req.query[key]){
			let reg = `.*${req.query[key]}.*`
			params.push({[key]: {$regex: reg, $options : 'i'}})
		}
	})

	let SearchCriteria = {$and : params};

	const client = getDbClient();
    await client.connect();
    
	const db = await client.db(constants.DB_NAME);

	db.collection(constants.DB_COLLECTION_NAME).find(SearchCriteria).toArray((err, result) => {
		if (err) throw err;
		return res.json({
 				result
			});
	  })
	  };

router.get("/get", searchBackup);
router.post("/create", createBackup);
router.delete("/purge", purgeBackup);

module.exports = router;
