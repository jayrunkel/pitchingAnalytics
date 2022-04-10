exports = async function(){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");
 */
 
 const aggPipeline = 
 [{$group: {
 _id: '$gameDetails.Game',
 Date: {
  $first: '$gameDetails.Date'
 },
 Opponent: {
  $first: '$gameDetails.Opponent'
 },
 HomeAway: {
  $first: '$gameDetails.HomeAway'
 }
}}, {$project: {
 _id: 0,
 Game: '$_id',
 Date: 1,
 Opponent: 1,
 HomeAway: 1
}}, {$sort: {
 Game: 1
}}];

  var collection = context.services.get("mongodb-atlas").db("Baseball").collection("battersView");
	const gameDetails = await collection.aggregate(aggPipeline).toArray();

	console.log("gameDetails: ", JSON.stringify(gameDetails));
	
  return gameDetails;
};
