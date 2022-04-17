exports = async function(game){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");
	*/

	const aggPipeline =
				[{$group: {
 _id: null,
 battersFaced: {
  $count: {}
 },
 strikeOuts: {
  $sum: {
   $cond: {
    'if': {
     $eq: [
      '$outcomeType',
      'K'
     ]
    },
    then: 1,
    'else': 0
   }
  }
 },
 outs: {
  $sum: {
   $cond: {
    'if': {
     $eq: [
      '$outcome',
      'Out'
     ]
    },
    then: 1,
    'else': 0
   }
  }
 },
 hits: {
  $sum: {
   $cond: {
    'if': {
     $eq: [
      '$outcome',
      'Hit'
     ]
    },
    then: 1,
    'else': 0
   }
  }
 },
 walks: {
  $sum: {
   $cond: {
    'if': {
     $eq: [
      '$outcome',
      'Walk'
     ]
    },
    then: 1,
    'else': 0
   }
  }
 },
 hitBatters: {
  $sum: {
   $cond: {
    'if': {
     $eq: [
      '$outcome',
      'HitByPitch'
     ]
    },
    then: 1,
    'else': 0
   }
  }
 },
 strikes: {
  $sum: {
   $reduce: {
    input: '$pitches',
    initialValue: 0,
    'in': {
     $add: [
      '$$value',
      {
       $cond: {
        'if': {
         $eq: [
          '$$this.BallStrike',
          'S'
         ]
        },
        then: 1,
        'else': 0
       }
      }
     ]
    }
   }
  }
 },
 balls: {
  $sum: {
   $reduce: {
    input: '$pitches',
    initialValue: 0,
    'in': {
     $add: [
      '$$value',
      {
       $cond: {
        'if': {
         $eq: [
          '$$this.BallStrike',
          'B'
         ]
        },
        then: 1,
        'else': 0
       }
      }
     ]
    }
   }
  }
 },
 firstPitchStrikes: {
  $sum: {
   $let: {
    vars: {
     firstPitch: {
      $first: '$pitches'
     }
    },
    'in': {
     $cond: {
      'if': {
       $eq: [
        '$$firstPitch.BallStrike',
        'S'
       ]
      },
      then: 1,
      'else': 0
     }
    }
   }
  }
 }
				}}];

	const matchStage = game === 0 ? null : [{$match: {'gameDetails.Game': game}}];

	console.log("game: ", game);
	console.log("matchStage: ", JSON.stringify(matchStage));
  var collection = context.services.get("mongodb-atlas").db("Baseball").collection("battersView");
	const gameDetails = await collection.aggregate(game === 0 ? aggPipeline : matchStage.concat(aggPipeline)).toArray();

	console.log("gameDetails: ", JSON.stringify(gameDetails));
	
  return gameDetails;
};