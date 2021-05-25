import React from 'react';
import './App.css';
import '@fontsource/roboto';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ItemForm from "./ItemForm";
import Grid from "./Grid";

/*
const API_SAVE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitems/";
const API_DELETE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitem/";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_GET_ITEM_PICTURES = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitempictures/";
const API_SAVE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitempicture/";
const API_DELETE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitempicture/";
const API_GET_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitem/";
*/

class App extends React.Component{
	render(){
		return(
			<div>
				<h1>Items</h1>
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
