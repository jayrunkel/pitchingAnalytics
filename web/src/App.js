// -*- mode: js-jsx;-*-

import React, { useState, useEffect } from 'react';
import './App.css';
import './Dashboard.css';
import * as Realm from "realm-web";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
//import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {Chart} from './Chart';
import {buildChartFilter, DashboardSelect} from './DashboardSelect';
import {GameStats} from './GameStats';
import CssBaseline from '@mui/material/CssBaseline';


const app = new Realm.App({ id: "pitchinganalytics-uchws" });


// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
}

function GameControls({games, numGames, curGameNum, setCurGameNum, showAllGames, setShowAllGames}) {

	function decrement () {
		if (curGameNum > 1) {
			setCurGameNum(curGameNum - 1);
		}
	}

	function increment() {
		if (curGameNum < numGames) {
			setCurGameNum(curGameNum + 1);
		}
	};

	function toggleShowAllGames(newState) {
		setShowAllGames(newState);
	}


		return (

				<Stack direction="row" spacing={20} justifyContent="space-evenly">
			{
				showAllGames 
					? <Button variant="outlined"
								startIcon={<RadioButtonCheckedIcon />}
								onClick={() => toggleShowAllGames(false)}>
						All Games
						</Button>
					: <Stack direction="row" spacing={2} justifyContent="space-evenly">
								<Stack direction="row" spacing={2} justifyContent="space-evenly">
										<label className="navLabel">Click To View All Game Data:</label>
										<Button variant="outlined"
												startIcon={<RadioButtonUncheckedIcon />}
												onClick={() => toggleShowAllGames(true)}>
										All Games
								</Button>
								</Stack>

								 <Stack direction="row" spacing={2} justifyContent="space-evenly">
										 <label className="navLabel">Select Game To View:</label> 
										 <Stack direction="row" spacing={1}>
												 <IconButton
														 color={showAllGames ? "disabled" : "primary"}
														 aria-label="Backward"
														 onClick={() => decrement() }>
														 <ArrowBackIcon />
												 </IconButton>
												 <NumberOfGames numGames={curGameNum}/>
												 <IconButton
														 color={showAllGames ? "disabled" : "primary"}
														 aria-label="Forward"
														 onClick={() => increment()}>
														 <ArrowForwardIcon />
												 </IconButton>
										 </Stack>
								 </Stack>
						</Stack>
			}
				</Stack>
	)
}

// Create a component that lets an anonymous user log in
function Login({ setUser }) {
  const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };
  return <button onClick={loginAnonymous}>Log In</button>;
}

function NumberOfGames({ numGames }) {
	return <span>{numGames}</span>
}

function App() {

	const [user, setUser] = useState(app.currentUser);
	const [allGames, setAllGames] = useState([]);
	const [numGames, setNumGames] = useState(0);
	const [curGameNum, setCurGameNum] = useState(1);
	const [showAllGames, setShowAllGames] = useState(false);
	const [selectedChartId, setSelectedChartId] = useState('');
	
	useEffect(() => {
		async function getGames() {
			try {
				const gameDetails = await user.functions.getAllGameDetails();
				console.log("setting game details");
				const nGames = gameDetails ? gameDetails.length : 0;
				console.log("number of games is ", nGames);
				setAllGames(gameDetails);
				setAllGames(gameDetails);
				setNumGames(nGames);
			} catch(error) {
				console.error("Error getting game details", error.message);
			}

		 }
		console.log("before getGames()");
		if (user) {
			getGames();
		}
		console.log("after getGames()");
	},
						[user]) //user.functions

	useEffect(() => {
		console.log("selectedChartId changed to: ", selectedChartId);
	},
						[selectedChartId])
	return (
		user ? 
					<div className="App">
					<CssBaseline />		
      <header className="App-header">
        <p>
					Pitching Analytics. Analyzing {<NumberOfGames numGames={numGames}/>} games.
        </p>
				{
					<GameControls games={allGames}
												numGames={numGames}
												curGameNum={curGameNum}
												setCurGameNum={setCurGameNum}
												showAllGames={showAllGames}
												setShowAllGames={setShowAllGames}
					/>
				}
      </header>
			<Stack className="statsBody" direction="column">
				<GameStats className="gameStats" games={allGames} showAllGames={showAllGames} gameNum={curGameNum} user={user}/>
				<Stack className="chartsSection" name="chartSection" direction="row">
					<DashboardSelect curSelectedChart={selectedChartId}
													 setCurSelectedChart={setSelectedChartId} />
					<div className="charts">
						{
							(selectedChartId)
								? <Chart height={'600px'} width={'800px'} filter={buildChartFilter(selectedChartId, showAllGames, curGameNum)} chartId={selectedChartId} />
							: <span>Select a chart from the list on the left</span>
						}
					</div>
				</Stack>
			</Stack>
		</div>
		:
			<div className="Footer">
				{user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
			</div>
	);
}

/*
 const [user, setUser] = React.useState(app.currentUser);
  // If a user is logged in, show their details.
  // Otherwise, show the login screen.
  return (
    <div className="App">
      <div className="App-header">
        {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
      </div>
    </div>
*/

export default App;
