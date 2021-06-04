import React from 'react';
import './App.css';
import '@fontsource/roboto';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ItemForm from "./ItemForm";
import Grid from "./Grid";

class App extends React.Component{
	render(){
		return(
			<div>
				<Router>
					<Switch>
						<Route path="/items/form" component={ItemForm}/>
						<Route path="/items" component={Grid}/>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
