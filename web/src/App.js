// -*- mode: js-jsx;-*-

import React, { useState, useEffect } from 'react';
import './App.css';
import * as Realm from "realm-web";

const app = new Realm.App({ id: "pitchinganalytics-uchws" });


// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
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
	const [startGame, setStartGame] = useState(null);
	const [endGame, setEndGame] = useState(null);
	const [allGames, setAllGames] = useState([]);
	const [numGames, setNumGames] = useState(0);
	
	useEffect(() => {
		 async function getGames() {
			await getGameDetails();
		 }
		console.log("before getGames()");
		getGames();
		console.log("after getGames()");
	},
						[])


	async function getGameDetails() {
		const gameDetails = await user.functions.getAllGameDetails();
		console.log("setting game details");
		const nGames = gameDetails ? gameDetails.length : 0;
		console.log("number of games is ", nGames);
		setAllGames(gameDetails);
		setAllGames(gameDetails);
		setStartGame(gameDetails[0]);
		setEndGame(gameDetails[nGames - 1]);
		setNumGames(nGames);
	}
	
  return (
    <div className="App">
      <header className="App-header">
        <p>
					Pitching Analytics. Analyzing {<NumberOfGames numGames={numGames}/>} games.
        </p>
      </header>
			<div className="App-header">
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
