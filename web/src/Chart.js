import React, {useEffect, useRef, useState} from 'react';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const baseUrl = 'https://charts.mongodb.com/charts-runkel-bbjup';


export const Dashboard = ({filter, height, width}) => {
  const sdk = new ChartsEmbedSDK({baseUrl: baseUrl});
	const dashboardDiv = useRef(null);
	const [rendered, setRendered] = useState(false);
	const [dashboard] = useState(sdk.createDashboard({
		baseUrl: baseUrl,
		dashboardId: '8949387e-bea0-456e-85ed-ff797ae1a094',
		height: height,
		width: width,
		theme: "dark"
	}));
	

	useEffect(() => {
    dashboard.render(dashboardDiv.current).then(() => setRendered(true)).catch(err => console.log("Error during Dashboard rendering.", err));
  }, [dashboard]);

/*	
  useEffect(() => {
    if (rendered) {
      dashboard.setFilter(filter).catch(err => console.log("Error while dashboard filtering.", err));
    }
  }, [dashboard, filter, rendered]);
*/	
	return <div className="dashboard" ref={dashboardDiv}/>;
}

export const Chart = ({filter, chartId, height, width}) => {
  const sdk = new ChartsEmbedSDK({baseUrl: 'https://charts.mongodb.com/charts-runkel-bbjup'});
  const chartDiv = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [chart] = useState(sdk.createChart({chartId: chartId, height: height, width: width, theme: "dark"}));

  useEffect(() => {
    chart.render(chartDiv.current).then(() => setRendered(true)).catch(err => console.log("Error during Charts rendering.", err));
  }, [chart]);

  useEffect(() => {
    if (rendered) {
      chart.setFilter(filter).catch(err => console.log("Error while filtering.", err));
    }
  }, [chart, filter, rendered]);

  return <div className="chart" ref={chartDiv}/>;
};




