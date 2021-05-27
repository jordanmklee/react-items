import React from "react";
import Carousel from "./Carousel";

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import AddIcon from '@material-ui/icons/Add';

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
		id: this.props.location.state.id,
		imageUrl: "",
		modifiedBy: "",
		modifiedByUser: "",
		name: "",
		recordStatus: "",
		recordStatusId: "",
		thumbImageUrl: "",
		
		pictures: [],
	}
	
	handleNameChange = (event) => {
		this.setState({ name: event.target.value })
	}

	handleRecordStatusIdChange = (event) => {
		this.setState({ recordStatusId: event.target.value })
	}

	handleNewPictureClick = (event) => {
		// TODO Add new picture functionality
		console.log("Adding new picture")
	}

	handleSaveClick = (event) => {
		// TODO Save button functionality
		console.log("Saving changes")
	}

	componentDidMount(){
		// Load Record Status dropdown values via API
		axios.get(API_GET_RECORD_STATUS_LIST)
			.then(res => {
				this.setState({	recordStatusList: res.data.data })

				// If editing, load existing values and pictures for item too
				if(this.props.location.state.id !== 0){
					axios.all([
						axios.get(API_GET_ITEM + this.props.location.state.id),
						axios.get(API_GET_ITEM_PICTURES + this.props.location.state.id)
					])
					.then(axios.spread((itemRes, pictureRes) => {
						// Parse picture response into array of URL/thumbnail URLs
						let imgs = [];
						pictureRes.data.data.forEach((img) => {
							imgs.push({	id: img.id,
										imageUrl: img.imageUrl,
										thumbImageUrl: img.thumbImageUrl	})
						})

						this.setState({	name: itemRes.data.data.name,
										recordStatusId: itemRes.data.data.recordStatusId,
			
										pictures: imgs })
					}))
				}
			})
	}
	
	render(){
		return(
			<Container><Paper>
				<div className="formContainer">
					{(this.state.id !== 0)
					?	(<>
							<h1>Edit</h1>
							<h2>Item {this.state.id}</h2>
						</>)
					:	( <h1>Add</h1> )}
					
						
					<div className="inputContainer">
						<TextField label="Name" value={this.state.name} variant="outlined" fullWidth onChange={this.handleNameChange}></TextField>
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

					<div style={{ paddingTop: "50px" }}>
						<Carousel pictures={this.state.pictures}/>
					</div>

					<div className="inputContainer">
						<Button
							variant="outlined"
							size="small"
							onClick={this.handleNewPictureClick}>
							<AddIcon/></Button>
					</div>

					<div className="inputContainer" style={{ paddingTop: "50px"}}>
						<div className="buttonContainer">
							<Link to="/">
								<Button variant="contained">Back</Button>
							</Link>
							<Button
								variant="contained"
								color="primary"
								onClick={this.handleSaveClick}>
								Save
							</Button>
						</div>
					</div>
				</div>
			</Paper></Container>
		)
	}
}

export default ItemForm;