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

function formatStatName(str) {
	return str.split(/(?=[A-Z])/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

export function GameStats({user, showAllGames, gameNum, games}) {

	const [gameDetails, setGameDetails] = useState(null);
	
	useEffect(() => {
		async function getGameStats(game) {
			try {
			    const gameStats = await user.functions.getGameStatsGroup(game);
			    setGameDetails(gameStats);
				
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
    console.log("gameDetails: ", JSON.stringify(gameDetails));

	return (
		<Stack className="gameStats" direction="column" spacing={2} justifyContent="space-evenly">
			<Stack key={1} direction="row" spacing={2} justifyContent="space-evenly">
				{
					(games && games.length > 0 && !showAllGames)  ? [
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
					gameDetails.map((statGroup) =>
					    <Stack key={statGroup.displayOrder} className="statGroup" direction="row" spacing={2} justify-content="space-evenly">
						{
						    Object.keys(statGroup.fields)
							.map((statName, idx) =>
							    <Item key={idx}>
								<Stack className="statBox" direction="column">
								    <label className="statLabel">{formatStatName(statName)}</label>
								    <div className="statValue">{statGroup.fields[statName]}</div>
								</Stack>
							    </Item>
							)
						}
					    </Stack>
					)
					: <div>loading game stats...</div>
				}
			</Stack>
		</Stack>
	);

}
