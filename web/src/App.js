// -*- mode: js-jsx;-*-

import React, { useState, useEffect } from 'react';
import './App.css';
import './Dashboard.css';
import * as Realm from "realm-web";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Stack from '@mui/material/Stack';
import Chart from './Chart';


const app = new Realm.App({ id: "pitchinganalytics-uchws" });


// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
}

function GameControls({games, numGames, curGameNum, setCurGameNum}) {

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
	

	return (
		<Stack direction="row" spacing={1}>
			<IconButton
				color="primary"
				aria-label="Backward"
				onClick={() => decrement() }>
				<ArrowBackIcon />
			</IconButton>
			<NumberOfGames numGames={curGameNum}/>
			<IconButton
				color="primary"
				aria-label="Forward"
			  onClick={() => increment()}>
				<ArrowForwardIcon />
			</IconButton>
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
	const [firstGame, setFirstGame] = useState(null);
	const [lastGame, setLastGame] = useState(null);
	const [allGames, setAllGames] = useState([]);
	const [numGames, setNumGames] = useState(0);
	const [curGameNum, setCurGameNum] = useState(1);
	
	useEffect(() => {
		 async function getGames() {
			 const gameDetails = await user.functions.getAllGameDetails();
			 console.log("setting game details");
			 const nGames = gameDetails ? gameDetails.length : 0;
			 console.log("number of games is ", nGames);
			 setAllGames(gameDetails);
			 setAllGames(gameDetails);
			 setFirstGame(gameDetails[0]);
			 setLastGame(gameDetails[nGames - 1]);
			 setNumGames(nGames);
		 }
		console.log("before getGames()");
		getGames();
		console.log("after getGames()");
	},
						[user.functions])


	
  return (

    <div className="App">
      <header className="App-header">
        <p>
					Pitching Analytics. Analyzing {<NumberOfGames numGames={numGames}/>} games.
        </p>
				{
					<GameControls games={allGames}
												numGames={numGames}
												curGameNum={curGameNum}
												setCurGameNum={setCurGameNum}
					/>
				}
      </header>
			<div className="charts">
				<Chart height={'600px'} width={'800px'} filter={{"gameDetails.Game" : curGameNum}} chartId={'6238cb4a-02d9-4646-8539-4ef6333e520b'} />
			</div>
			<div className="Footer">
        {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
      </div>
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
