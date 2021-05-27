import React from 'react';
import './App.css';
import '@fontsource/roboto';

import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ItemForm from "./ItemForm";
import Grid from "./Grid";

class App extends React.Component{
	render(){
		return(
			<div>
				<Container>
					<h1>Items</h1>
				</Container>
				<Router>
					<Switch>
						<Route path="/form" component={ItemForm}/>
						<Route path="/" component={Grid}/>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
