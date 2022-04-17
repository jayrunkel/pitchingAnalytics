import React, {useEffect, useRef, useState} from 'react';
import Stack from '@mui/material/Stack';
import './App.css';

const chartList =
{
	baseUrl : "https://charts.mongodb.com/charts-runkel-bbjup",
	charts: [
		{
			chartNum: 1,
			name: "Game Summary",
			chartId: "622f78c0-8117-4aeb-8e41-3472988fe4ed",
			gameFilterField: {"gameDetails.Game": null},
		},
		{
			chartNum: 2,
			name: "Pitch Velocity By Game and Pitch Type",
			chartId: "6238cb4a-02d9-4646-8539-4ef6333e520b",
			gameFilterField: {"gameDetails.Game": null},
		},
		{
			chartNum: 3,
			name: "Fastball Velocity By Pitch",
			chartId: "622f7b9a-2378-4bb7-8cd7-34915afc3ff1",
			gameFilterField: {Game: null},
		},
		{
			chartNum: 4,
			name: "Pitch Velocity By Inning",
			chartId: "622f7d57-8117-42ee-86fc-34729895dac7",
			gameFilterField: {Game: null},
		},
		{
			chartNum: 5,
			name: "Pitch Percentages By Game",
			chartId: "624c5b44-a2bc-4bad-85e8-4c26fc1ee5cd",
			gameFilterField: {"gameDetails.Game": null},
		},
		{
			chartNum: 6,
			name: "Pitches Per Inning/Batter",
			chartId: "622f84cb-f865-484f-8dec-66f750314e8d",
			gameFilterField: {"gameDetails.Game": null},
		},
		{
			chartNum: 7,
			name: "Pitch Breakdown",
			chartId: "624c573f-ccf6-4052-8a41-35949d44dcfa",
			gameFilterField: {"gameDetails.Game": null},
		},
		{
			chartNum: 8,
			name: "Ball and Strike Percentages By Pitch",
			chartId: "625af073-8858-4a52-8446-eda326a5b7da",
			gameFilterField: {"Game": null}
		},
	]
};

export function buildChartFilter(chartId, showAllGames, gameSelection) {
	
	let filter = {};
	let cObj = chartList.charts.find((chartObj) => chartObj.chartId === chartId);
	if (!showAllGames && gameSelection) {
		filter = JSON.parse(JSON.stringify(cObj.gameFilterField).replace('null', gameSelection));
	}
	console.log("Returning filter: ", JSON.stringify(filter));
	return filter;
}

export const DashboardSelect = ({ curSelectedChart, setCurSelectedChart}) => {

	const handleClick = (chartId) => {
		setCurSelectedChart(chartId);
		console.log("Selected chart: ", chartId);
	};

	const charts = chartList.charts.map((chartObj) => {
		return (
			<label class="chartSelectLabel"
						 key={chartObj.chartNum}
						 styles={chartObj.chartId === curSelectedChart ? {color: 'green', 'text-decoration-color': 'green'} : {}}
						 onClick={() => handleClick(chartObj.chartId)}>{
				chartObj.name
			}
			</label>
		);
	});
	
	return (

		<Stack direction="column">
			{charts}
		</Stack>
/*		
		<Stack direction="row">
			<label htmlFor="chartSelect">Select Chart</label>
			<select name="chartSelect" className="chartSelect" value={curSelectedChart} onChange={handleChange}>
				{options}
			</select>
		</Stack>
*/
	);
	
}
