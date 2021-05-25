import React from 'react';
import './App.css';
import '@fontsource/roboto';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ItemForm from "./ItemForm";
import Grid from "./Grid";

import axios from "axios";
const API_GET_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitems/";
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
	state = {
		items: [],

		numItemsPerPage: 20,
		pageNum: 1,
	}
	
	componentDidMount(){
		// Get items via API
		axios.get(API_GET_ITEMS + this.state.numItemsPerPage + "/" + this.state.pageNum)
			.then(res => {
				res.data.data.forEach((item) => {
					console.log(item)
				})
			})
	}

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
