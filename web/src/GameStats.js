// -*- mode: js-jsx;-*-

import React, { useState, useEffect } from 'react';
//import * as Realm from "realm-web";
import Stack from '@mui/material/Stack';
import './GameStats.css';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function GameStats({user, showAllGames, gameNum}) {

	const [gameDetails, setGameDetails] = useState(null);
	
	useEffect(() => {
		async function getGameStats(game) {
			try {
				const gameStats = await user.functions.getGameStats(game);
				setGameDetails(gameStats[0]);
				
			} catch(error) {
				console.error("Error getting game stats", error.message);
			}
		}

		if (user) {
			getGameStats(showAllGames ? 0 : gameNum)
		}
	}, [showAllGames, gameNum, user])



	return (
		<Stack name="gameStats" direction="row" spacing={2} justifyContent="space-evenly">
			{
				gameDetails ?
					Object.keys(gameDetails).
					filter((key) => key != "_id")
					.map((statName, idx) =>
						<Item key={idx}>
							<Stack className="statBox" direction="column">
								<label name="statLabel">{statName}</label>
								<div name="statValue">{gameDetails[statName]}</div>
							</Stack>
						</Item>
					)
					: <div>loading game stats...</div>
			}
		</Stack>
	);

}
