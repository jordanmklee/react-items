import React from "react";

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import Slider from "react-slick";

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { Link } from "react-router-dom";

import axios from "axios";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_GET_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitem/";
const API_GET_ITEM_PICTURES = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitempictures/";
const API_SAVE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitems/";
//const API_SAVE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitempicture/";
//const API_DELETE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitempicture/";

class ItemForm extends React.Component{
	state = {
		recordStatusList: [],
		
		id: this.props.location.state.id,
		name: "",
		recordStatusId: "",
		createdBy: "",
		
		pictures: [],
		currentIndex: 0,
	}
	
	handleNameChange = (event) => {
		this.setState({ name: event.target.value })
	}

	handleRecordStatusIdChange = (event) => {
		console.log(event)
		this.setState({ recordStatusId: event.target.value })
	}
	
	handlePictureChange = (newIndex) => {
        console.log(newIndex)
		this.setState({ currentIndex: newIndex})
	}

	handleDeletePictureclick = (event) => {
		let statePictures = [...this.state.pictures]
		statePictures.splice(this.state.currentIndex, 1);

		// TODO Call API to delete picture

		this.setState({ pictures: statePictures })
	}

	handleNewPictureClick = (event) => {
		let statePictures = [...this.state.pictures]
		// TODO 
		/* statePictures.push({
			id: 0,
			imageUrl: "",
			thumbImageUrl: "",
		})
		*/

		// TODO Call API to add new picture
		/*
			Id
			ItemId
			FileUrl
			Main
			CreatedBy
		*/
		
		console.log(statePictures)

		this.setState({ pictures: statePictures })
	}

	handleSaveClick = (event) => {
		// TODO Save added images?
		let newItem = {
			Content: "[{"
					+ "Id:" + this.state.id + "," 
					+ "Name:'" + this.state.name + "',"
					+ "RecordStatusId:" + this.state.recordStatusId + ","
					+ "CreatedBy:" + this.state.createdBy + ","
					+ "ModifiedBy:1},]"	// TODO Hardcoded
		}
		
		let config = { "Content-Type": "application/json" }

		console.log(newItem)
		axios.post(API_SAVE_ITEMS, newItem, config)
			.then(res => {
				console.log(res);
			})

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
										createdBy: itemRes.data.data.createdBy,
			
										pictures: imgs })
					}))
				}
			})
	}
	
	render(){
		const settings = {
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
		}

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
									<MenuItem
										key={status.id}
										value={status.id}>{status.name}</MenuItem>
								)) }
							</Select>
						</FormControl>
					</div>


					{/* Carousel */}
					<div style={{ paddingTop: "50px" }}>
						<div style={{ margin: "auto", textAlign: "center", width: "90%" }}>
							<Slider {...settings} afterChange={this.handlePictureChange}>

							{this.state.pictures.map((image) => (
								<div key={image.id}>
									<img style={{ margin: "auto", height: "300px" }}
										key={image.id}
										src={image.imageUrl}
										alt=""/>
								</div>
							))}
							
							</Slider>
						</div>
					</div>



					<div className="inputContainer">
						<div className="buttonContainer">
							<Button
								variant="outlined"
								size="small"
								onClick={this.handleDeletePictureclick}>
								<DeleteIcon/></Button>
							<Button
								variant="outlined"
								size="small"
								onClick={this.handleNewPictureClick}>
								<AddIcon/></Button>
						</div>
					</div>



					<div className="inputContainer" style={{ paddingTop: "50px"}}>
						<div className="buttonContainer">
							<Link to="/">
								<Button
									variant="contained"
									size="large">
									Back</Button>
							</Link>
							<Button
								variant="contained"
								color="primary"
								size="large"
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