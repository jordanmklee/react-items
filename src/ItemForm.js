import React from "react";
import { Redirect } from 'react-router'

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';

import Slider from "react-slick";

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import FormData from "form-data";

import { Link } from "react-router-dom";

import axios from "axios";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_GET_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitem/";
const API_GET_ITEM_PICTURES = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitempictures/";
const API_SAVE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitems/";
const API_SAVE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitempicture/";
const API_DELETE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitempicture/";

class ItemForm extends React.Component{
	state = {
		redirectToGrid: false,
		emptyFields: false,

		recordStatusList: [],
		
		id: this.props.location.state.id,
		name: "",
		recordStatusId: "",
		createdBy: 1,		// TODO Harcoded; new items are created by current user (user 1); otherwise loaded from edited item
		modifiedBy: 1,		// TODO Harcoded; modified by current user (user 1)
		
		pictures: [],
		currentIndex: 0,

		selectedFile: "",
		selectedFileName: "",
		setAsMain: false,
	}



	// Toggles state variable for new picture to be thumbnail
	handleSetMainClick = (event) => {
		this.setState({ setAsMain: !this.state.setAsMain })
	}

	// Updates filename and file in state based on form input
	handleChooseFile = (event) => {
		this.setState({	selectedFile: event.target.files[0],
						selectedFileName: event.target.value })
	}
	
	

	// TODO Use this for all changes?
	/*
	const handleOnChange = e => {
		setFormValues({
		...formValues,
		[e.target.name]: e.target.value
		});
	};
	*/

	
	// Updates name in state to name TextField value
	handleNameChange = (event) => {
		this.setState({ name: event.target.value })
	}



	// Updates recordStatusId in state to recordStatusId dropdown value
	handleRecordStatusIdChange = (event) => {
		this.setState({ recordStatusId: event.target.value })
	}
	


	// Updates currentIndex to index of picture shown in carousel
	handlePictureChange = (newIndex) => {
		this.setState({ currentIndex: newIndex})
	}



	// Deletes currently shown picture in carousel
	handleDeletePictureclick = (event) => {
		let currentId = this.state.pictures[this.state.currentIndex].id;
		
		axios.delete(API_DELETE_ITEM_PICTURE
			+ currentId + "/"		// image id
			+ this.state.id + "/"	// itemId
			+ "1/")					// userId (TODO hardcoded = 1)
			.then(res => {
				console.log(res)
				this.updateCarousel();
			})
	}



	// Adds new picture to item
	handleNewPictureClick = (event) => {
		// Only attempts to API Add file if there is a file selected
		if(this.state.selectedFile !== ""){
			var data = new FormData();
			data.append('Id', 0);
			data.append('ItemId', this.state.id);
			data.append('Main', this.state.setAsMain);
			data.append('ModifiedBy', this.state.modifiedBy);
			data.append("FileUrl", this.state.selectedFile)
	
			let config = {
				"Accept": "application/json",
				"Content-Type": "multipart/form-data",
			}
	
			axios.post(API_SAVE_ITEM_PICTURE, data, config)
				.then(res => {
					this.updateCarousel();		// Update carousel after adding
					
					// Reset input fields for next picture
					this.setState({ selectedFile: "",
									selectedFileName: "",
									setAsMain: false  })
				})
		}
	}



	// Saves current item via API
	handleSaveClick = (event) => {
		if(this.state.name === "" || this.state.recordStatusId === ""){
			this.setState({ emptyFields: true})
		}
		else{
			// Save item details
			let newItem = {
				Content: "[{"
				+ "Id:" + this.state.id + "," 
				+ "Name:'" + this.state.name + "',"
				+ "RecordStatusId:" + this.state.recordStatusId + ","
				+ "CreatedBy:" + this.state.createdBy + ","
				+ "ModifiedBy:" + this.state.modifiedBy + "},]"
			}
			
			let config = { "Content-Type": "application/json" }
			
			axios.post(API_SAVE_ITEMS, newItem, config)
			.then(res => {
				console.log(res);
			})

			// Redirect to grid
			this.setState({ redirectToGrid: true });
		}
	}



	// Retrieves pictures for item from API, and displays them on carousel
	updateCarousel = () => {
		axios.get(API_GET_ITEM_PICTURES + this.state.id)
			.then(res => {
				this.setState({ pictures: res.data.data})
			})
	}



	componentDidMount(){
		// Load Record Status dropdown values via API
		axios.get(API_GET_RECORD_STATUS_LIST)
			.then(res => {
				this.setState({	recordStatusList: res.data.data })

				// If editing, load existing values and pictures for item too
				if(this.state.id !== 0){
					axios.get(API_GET_ITEM + this.state.id)
					.then(res => {
						this.setState({	name: res.data.data.name,
										recordStatusId: res.data.data.recordStatusId,
										createdBy: res.data.data.createdBy	})			// Load original creator
						
						this.updateCarousel();
					})
				}
			})
	}
	



	render(){
		const settings = {
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
		}
		
		// TODO pagination count doesn't update on save
		if(this.state.redirectToGrid){
			return <Redirect to="/items"/>
		}

		return(
			<Container className="paperContainer"><Paper>
				<div className="formContainer">
					{(this.state.id !== 0)
					?	(<>
							<h1>Edit</h1>
							<h2>Item {this.state.id}</h2>
						</>)
					:	( <h1>Add</h1> )}
					
						

					<div className="inputContainer">
						<TextField label="Name" variant="outlined" fullWidth required
						error={this.state.emptyFields}
							value={this.state.name}
							onChange={this.handleNameChange}>
						</TextField>
					</div>



					<div className="inputContainer">
						<FormControl variant="outlined" fullWidth required
							error={this.state.emptyFields}>
							<InputLabel>Record Status</InputLabel>
							<Select label="Record Status" variant="outlined" fullWidth
								value={this.state.recordStatusId}
								onChange={this.handleRecordStatusIdChange}>
									{ this.state.recordStatusList.map((status) => (
										<MenuItem
											key={status.id}
											value={status.id}>
												{status.name}
										</MenuItem>
									)) }
							</Select>
						</FormControl>
					</div>


					{/* Carousel */}
					<div style={{ paddingTop: "50px" }}>
						<div style={{ margin: "auto", paddingBottom: "50px"}}>
							{this.state.pictures.map((image, index) => (
								<img className="thumbnail" style={{ paddingLeft: "10px"}}
									onClick={e => this.slider.slickGoTo(e.target.dataset.index)}
									key={image.id}
									src={image.thumbImageUrl}
									alt=""
									data-index={index}/>
							))}
						</div>

						<div style={{ margin: "auto", textAlign: "center", width: "90%", paddingBottom: "50px"}}>
							<Slider ref={slider => (this.slider = slider)} {...settings}
								afterChange={this.handlePictureChange}>

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


					{/* File Browser for new picture */}
					<div>
						<form>
							<input
								type="file"
								value={this.state.selectedFileName}
								onChange={this.handleChooseFile}/>
								
						</form>
						<p>Set as Main<Checkbox checked={this.state.setAsMain} onChange={this.handleSetMainClick}/></p>
					</div>


					{/* Back/Save Buttons */}
					<div className="inputContainer">
						<div className="buttonContainer">
							<Button variant="outlined" size="small"
								onClick={this.handleDeletePictureclick}>
								<DeleteIcon/></Button>
							<Button variant="outlined" size="small"
								onClick={this.handleNewPictureClick}>
								<AddIcon/></Button>
						</div>
					</div>



					<div className="inputContainer" style={{ paddingTop: "50px"}}>
						<div className="buttonContainer">
							<Link to="/items">
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