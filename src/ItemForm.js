import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router'
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import Slider from "react-slick";

import FormData from "form-data";

import axios from "axios";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_GET_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitem/";
const API_GET_ITEM_PICTURES = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitempictures/";
const API_SAVE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitems/";
const API_SAVE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitempicture/";
const API_DELETE_ITEM_PICTURE = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitempicture/";

function ItemForm(props){
	const [redirectToGrid, setRedirectToGrid] = useState(false);
	const [emptyFields, setEmptyFields] = useState(false);
	const [recordStatusList, setRecordStatusList] = useState([]);
	
	const [id] = useState(props.location.state.id);
	const [name, setName] = useState("");
	const [recordStatusId, setRecordStatusId] = useState("");
	const [createdBy, setCreatedBy] = useState(1);				// TODO Harcoded; new items are created by current user (user 1); otherwise loaded from edited item
	//const [modifiedBy, setModifiedBy] = useState(1);			// TODO include setModifiedBy when current user is implemented
	const [modifiedBy] = useState(1);			// TODO Harcoded current user = 1
	
	const [pictures, setPictures] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	
	const [selectedFile, setSelectedFile] = useState("");
	const [selectedFileName, setSelectedFileName] = useState("");
	const [setAsMain, setSetAsMain] = useState(false);
	
	let slider1 = [];
	
	// Carousel settings
	const settings = {
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
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

	// Toggles state variable for new picture to be thumbnail
	const handleSetMainClick = (event) => {
		setSetAsMain(!setAsMain)
	}


	// Updates filename and file in state based on form input
	const handleChooseFile = (event) => {
		setSelectedFile(event.target.files[0]);
		setSelectedFileName(event.target.value);
	}


	// Updates name in state to name TextField value
	const handleNameChange = (event) => {
		setName(event.target.value);
	}


	// Updates recordStatusId in state to recordStatusId dropdown value
	const handleRecordStatusIdChange = (event) => {
		setRecordStatusId(event.target.value);
	}
	

	// Updates currentIndex to index of picture shown in carousel
	const handlePictureChange = (newIndex) => {
		setCurrentIndex(newIndex);
	}


	// Deletes currently shown picture in carousel
	const handleDeletePictureclick = (event) => {
		let currentId = pictures[currentIndex].id;
		
		axios.delete(API_DELETE_ITEM_PICTURE
			+ currentId + "/"		// image id
			+ id + "/"	// itemId
			+ "1/")					// userId (TODO hardcoded = 1)
			.then(res => {
				console.log(res)
				updateCarousel();
			})
	}


	// Adds new picture to item
	const handleNewPictureClick = (event) => {
		// Only attempts to API Add file if there is a file selected
		if(selectedFile !== ""){
			var data = new FormData();
			data.append('Id', 0);
			data.append('ItemId', id);
			data.append('Main', setAsMain);
			data.append('ModifiedBy', modifiedBy);
			data.append("FileUrl", selectedFile)
	
			let config = {
				"Accept": "application/json",
				"Content-Type": "multipart/form-data",
			}
	
			axios.post(API_SAVE_ITEM_PICTURE, data, config)
				.then(res => {
					updateCarousel();		// Update carousel after adding
					
					// Reset input fields for next picture
					setSelectedFile("");
					setSelectedFileName("");
					setSetAsMain(false);
				})
		}
	}


	// Saves current item via API
	const handleSaveClick = (event) => {
		if(name === "" || recordStatusId === ""){
			setEmptyFields(true);
		}
		else{
			// Save item details
			let newItem = {
				Content: "[{"
				+ "Id:" + id + "," 
				+ "Name:'" + name + "',"
				+ "RecordStatusId:" + recordStatusId + ","
				+ "CreatedBy:" + createdBy + ","
				+ "ModifiedBy:" + modifiedBy + "},]"
			}
			
			let config = { "Content-Type": "application/json" }
			
			axios.post(API_SAVE_ITEMS, newItem, config)
			.then(res => {
				console.log(res);
			})

			// Redirect to grid
			setRedirectToGrid(true);
		}
	}


	// Retrieves pictures for item from API, and displays them on carousel
	const updateCarousel = () => {
		axios.get(API_GET_ITEM_PICTURES + id)
			.then(res => {
				setPictures(res.data.data);
			})
	}


	// First load ie. componentDidMount()
	useEffect(() => {
		// Load Record Status dropdown values via API
		axios.get(API_GET_RECORD_STATUS_LIST)
		.then(res => {
				setRecordStatusList(res.data.data);
				
				// If editing, load existing values and pictures for item too
				if(id !== 0){
					axios.get(API_GET_ITEM + id)
					.then(res => {
						setName(res.data.data.name);
						setRecordStatusId(res.data.data.recordStatusId);
						setCreatedBy(res.data.data.createdBy);			// Load original creator
						
						updateCarousel();
					})
				}
			})	
	}, [])

	
	// TODO pagination count doesn't update on save
	if(redirectToGrid){
		return <Redirect to="/items"/>
	}

	return(
		<Container className="paperContainer"><Paper>
			<div className="formContainer">
				{(id !== 0)
				?	(<>
						<h1>Edit</h1>
						<h2>Item {id}</h2>
					</>)
				:	( <h1>Add</h1> )}
				

				<div className="inputContainer">
					<TextField label="Name" variant="outlined" fullWidth required
					error={emptyFields}
						value={name}
						onChange={handleNameChange}>
					</TextField>
				</div>


				<div className="inputContainer">
					<FormControl variant="outlined" fullWidth required
						error={emptyFields}>
						<InputLabel>Record Status</InputLabel>
						<Select label="Record Status" variant="outlined" fullWidth
							value={recordStatusId}
							onChange={handleRecordStatusIdChange}>
								{ recordStatusList.map((status) => (
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
						{pictures.map((image, index) => (
							<img className="thumbnail" style={{ paddingLeft: "10px"}}
								onClick={e => slider1.slickGoTo(e.target.dataset.index)}
								key={image.id}
								src={image.thumbImageUrl}
								alt=""
								data-index={index}/>
						))}
					</div>

					<div style={{ margin: "auto", textAlign: "center", width: "90%", paddingBottom: "50px"}}>
						<Slider ref={slider => (slider1 = slider)} {...settings}
							afterChange={handlePictureChange}>

						{pictures.map((image) => (
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
							value={selectedFileName}
							onChange={handleChooseFile}/>
							
					</form>
					<p>Set as Main<Checkbox checked={setAsMain} onChange={handleSetMainClick}/></p>
				</div>


				{/* Back/Save Buttons */}
				<div className="inputContainer">
					<div className="buttonContainer">
						<Button variant="outlined" size="small"
							onClick={handleDeletePictureclick}>
							<DeleteIcon/></Button>
						<Button variant="outlined" size="small"
							onClick={handleNewPictureClick}>
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
							onClick={handleSaveClick}>
							Save
						</Button>
					</div>
				</div>
			</div>
		</Paper></Container>
	)
	
}

export default ItemForm;