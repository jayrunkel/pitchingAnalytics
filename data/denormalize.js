[{$sort: {
 Game: 1,
 PitchNumber: 1
}}, {$group: {
 _id: {
  game: '$Game',
  batterNumber: '$BatterNumber'
 },
 Game: {
  $first: '$Game'
 },
 Date: {
  $first: '$Date'
 },
 Opponent: {
  $first: '$Opponent'
 },
 HomeAway: {
  $first: '$HomeAway'
 },
 Inning: {
  $first: '$Inning'
 },
 Outcome: {
  $last: '$Outcome'
 },
 Pitches: {
  $push: {
   PitchNumber: '$PitchNumber',
   Pitch: '$Pitch',
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
   Outcome: '$Outcome',
   Velocity: '$Velocity'
  }
 },
 NumPitches: {
  $sum: 1
 },
 AvgVelo: {
  $avg: '$Velocity'
 },
 FBAvgVelo: {
  $avg: {
   $cond: {
    'if': {
     $eq: [
      '$Pitch',
      1
     ]
    },
    then: '$Velocity',
    'else': null
   }
  }
 },
 CurveAvgVelo: {
  $avg: {
   $cond: {
    'if': {
     $eq: [
      '$Pitch',
      2
     ]
    },
    then: '$Velocity',
    'else': null
   }
  }
 },
 SlideAvgVelo: {
  $avg: {
   $cond: {
    'if': {
     $eq: [
      '$Pitch',
      3
     ]
    },
    then: '$Velocity',
    'else': null
   }
  }
 },
 ChangeAvgVelo: {
  $avg: {
   $cond: {
    'if': {
     $eq: [
      '$Pitch',
      4
     ]
    },
    then: '$Velocity',
    'else': null
   }
  }
 }
}}, {$project: {
 _id: 0,
 batterNumber: '$_id.batterNumber',
 gameDetails: {
  Game: '$Game',
  Date: '$Date',
  Opponent: '$Opponent',
  HomeAway: '$HomeAway'
 },
 inning: '$Inning',
 outcomeDetails: '$Outcome',
 outcome: {
  $first: {
   $split: [
    '$Outcome',
    ':'
   ]
  }
 },
 outcomeType: {
  $let: {
   vars: {
    outcome: {
     $first: {
      $split: [
       '$Outcome',
       ':'
      ]
     }
    },
    outcomeDesc: {
     $arrayElemAt: [
      {
       $split: [
        '$Outcome',
        ':'
       ]
      },
      1
     ]
    }
   },
   'in': {
    $switch: {
     branches: [
      {
       'case': {
        $eq: [
         '$$outcome',
         'Hit'
        ]
       },
       then: '$$outcomeDesc'
      },
      {
       'case': {
        $eq: [
         '$Outcome',
         'Out: K'
        ]
       },
       then: 'K'
      },
      {
       'case': {
        $eq: [
         '$$outcome',
         'Out'
        ]
       },
       then: {
        $cond: {
         'if': {
          $gte: [
           {
            $indexOfCP: [
             '$$outcomeDesc',
             'F'
            ]
           },
           0
          ]
         },
         then: 'FO',
         'else': 'GO'
        }
       }
      }
     ],
     'default': '$$outcome'
    }
   }
  }
 },
 pitches: {
  $let: {
   vars: {
    firstPitch: {
     $arrayElemAt: [
      '$Pitches',
      0
     ]
    }
   },
   'in': {
    $map: {
     input: '$Pitches',
     'in': {
      $mergeObjects: [
       '$$this',
       {
        BatterPitchNumber: {
         $add: [
          {
           $subtract: [
            '$$this.PitchNumber',
            '$$firstPitch.PitchNumber'
           ]
          },
          1
         ]
        }
       }
      ]
     }
    }
   }
  }
 },
 numPitches: '$NumPitches',
 veloSummary: {
  avgVelo: '$AvgVelo',
  FBAvgVelo: '$FBAvgVelo',
  CurveAvgVelo: '$CurveAvgVelo',
  SlideAvgVelo: '$SlideAvgVelo',
  ChangeAvgVelo: '$ChangeAvgVelo'
 }
}}, {$out: 'batters'}]
