import React from "react";

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import { Link } from "react-router-dom";

import axios from "axios";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_GET_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitem/";
const API_GET_ITEM_PICTURES = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitempictures/";

class ItemForm extends React.Component{
	state = {
		recordStatusList: [],
		
		createdBy: "",
		createdByUser: "",
		dateCreated: "",
		dateModified: "",
		id: "",
		imageUrl: "",
		modifiedBy: "",
		modifiedByUser: "",
		name: "",
		recordStatus: "",
		recordStatusId: "",
		thumbImageUrl: "",
		
		pictures: [],
	}
	
	handleRecordStatusIdChange = (event) => {
		this.setState({ recordStatusId: event.target.value })
	}

	componentDidMount(){
		// Load Record Status dropdown values, existing values for item, pictures via API
		axios.all([
			axios.get(API_GET_RECORD_STATUS_LIST),
			axios.get(API_GET_ITEM + this.props.location.state.id),
			axios.get(API_GET_ITEM_PICTURES + this.props.location.state.id)
		])
		.then(axios.spread((recordStatusRes, itemRes, pictureRes) => {
			// Parse picture response into array of URL/thumbnail URLs
			let imgs = [];
			pictureRes.data.data.forEach((img) => {
				imgs.push({	id: img.id,
							imageUrl: img.imageUrl,
							thumbImageUrl: img.thumbImageUrl	})
			})

			this.setState({	recordStatusList: recordStatusRes.data.data,
							
							id: itemRes.data.data.id,
							name: itemRes.data.data.name,
							recordStatusId: itemRes.data.data.recordStatusId,

							pictures: imgs })
		}))
	}
	
	render(){
		// TODO Hardcoded 500px width for form
		return(
			<Container style={{width: "500px"}}><Paper>
				<div className="formContainer">
					<h1>Edit</h1>
					<h2>Item {this.state.id}</h2>
						
					<div className="inputContainer">
						<TextField label="Name" value={this.state.name} variant="outlined" fullWidth></TextField>
					</div>

					<div className="inputContainer">
						<FormControl variant="outlined" fullWidth>
							<InputLabel>Record Status</InputLabel>
							<Select
							label="Record Status"
							value={this.state.recordStatusId}
							onChange={this.handleRecordStatusIdChange}
							variant="outlined"
							fullWidth>
								{ this.state.recordStatusList.map((status) => (
									<MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
								)) }
							</Select>
						</FormControl>
					</div>

					<div className="inputContainer">
						{this.state.pictures.map((image) => (
							<img className="thumbnail" key={image.id} src={image.thumbImageUrl} alt=""/>
						))}
					</div>

					<div className="inputContainer">
						<div className="buttonContainer">
							<Link to="/"><Button variant="contained">Back</Button></Link>
							<Button variant="contained" color="primary">Save</Button>
						</div>
					</div>
				</div>
			</Paper></Container>
		)
	}
}

export default ItemForm;