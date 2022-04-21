
import  yargs from "yargs" // "yargs/yargs"
import { MongoClient } from "mongodb";
import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv)).argv

const config = {
	uri : argv.uri || "mongodb://locahost:27017",
	db : argv.db || "Baseball",
	collection : argv.collection || "pitching",
	game: argv.game || 9999,
	opponent: argv.opponent || "Grinnell College",
 	homeaway: argv.homeaway || "Home",
}

console.log(config)

let pipeline =
[{$addFields: {
 PitchName: {
  $switch: {
   branches: [
    {
     'case': {
      $eq: [
       '$Pitch',
       1
      ]
     },
     then: 'Fast Ball'
    },
    {
     'case': {
      $eq: [
       '$Pitch',
       2
      ]
     },
     then: 'Curve Ball'
    },
    {
     'case': {
      $eq: [
       '$Pitch',
       3
      ]
     },
     then: 'Slider'
    },
    {
     'case': {
      $eq: [
       '$Pitch',
       4
      ]
     },
     then: 'Changeup'
    }
   ],
   'default': 'Unknown'
  }
 },
 BallStrike: {
  $trim: {
   input: '$BallStrike'
  }
 },
		Game: config.game,
		Opponent: config.opponent,
		HomeAway: config.homeaway
}}];

async function connectToDatabase() {
	const c = new MongoClient(config.uri)
	await c.connect()
	return c
}

async function run() {
  let client = await connectToDatabase()
	let db = client.db(config.db)
	let col = db.collection(config.collection)

//		var result = await col.aggregate(pipeline).toArray()
		var result = await col.updateMany(
				{Game: {$exists: false}},
				pipeline);
		console.log(result);
		console.log(JSON.stringify(result));
	client.close()
}

run()
