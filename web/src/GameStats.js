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

export function GameStats({user, showAllGames, gameNum, games}) {

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


	console.log("Building Game Stats section: ", JSON.stringify(games));
	console.log("gameNum: ", gameNum);
	console.log("games[gameNum - 1]: ", games[gameNum - 1]);

	return (
		<Stack className="gameStats" direction="column" spacing={2} justifyContent="space-evenly">
			<Stack key={1} direction="row" spacing={2} justifyContent="space-evenly">
				{
					(games && games.length > 0)  ? [
						<Item key={1}><b>Date:</b> {games[gameNum - 1].Date.toString()}</Item>,
						<Item key={2}><b>Opponent:</b> {games[gameNum - 1].Opponent}</Item>,
						<Item key={3}><b>Location:</b> {games[gameNum - 1].HomeAway}</Item>
					]
					: <Item>Showing all games</Item>
				}
			</Stack>
			<Stack key={2} direction="row" spacing={2} justifyContent="space-evenly">
				{
					gameDetails ?
						Object.keys(gameDetails)
						.filter((key) => key !== "_id")
						.map((statName, idx) =>
							<Item key={idx}>
								<Stack className="statBox" direction="column">
									<label className="statLabel">{statName}</label>
									<div className="statValue">{gameDetails[statName]}</div>
								</Stack>
							</Item>
						)
						: <div>loading game stats...</div>
				}
			</Stack>
		</Stack>
	);

}
