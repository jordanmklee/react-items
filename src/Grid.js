import React from 'react';
import GridButtons from "./GridButtons"

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import TextField from '@material-ui/core/TextField';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';

import { Link } from "react-router-dom";

import axios from "axios";
const API_GET_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitems/";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";
const API_DELETE_ITEM = "https://bimiscwebapi-test.azurewebsites.net/api/misc/deleteitem/";
const API_SAVE_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/saveitems/";

class Grid extends React.Component{
	state = {
		items: [],

		totalNumItems: 0,
		numItemsPerPage: 20,
		pageNum: 1,
		searchTerm: "",

		deleteMode: false,
		editMode: false,
		allSelected: false,
		recordStatusList: [],
	}

	// Update grid items via API
	updateGrid(){
		axios.get(API_GET_ITEMS + this.state.numItemsPerPage + "/" 
								+ this.state.pageNum + "/" 
								+ this.state.searchTerm)
			.then(res => {
				var newTotalNumItems = parseInt(res.data.message);
				var newItemsState = [];
				res.data.data.forEach((item) => {
					newItemsState.push({                         
						id: item.id,
						name: item.name,
						createdBy: item.createdBy,
						dateCreated: item.dateCreated,
						modifiedBy: item.modifiedBy,
						dateModified: item.dateModified,
						recordStatusId: item.recordStatusId,
						recordStatus: item.recordStatus,
						createdByUser: item.createdByUser,
						modifiedByUser: item.modifiedByUser,
						imageUrl: item.imageUrl,
						thumbImageUrl: item.thumbImageUrl,

						isSelected: false,
					})
				})
			
				this.setState({ items: newItemsState, totalNumItems: newTotalNumItems });
			})
	}

	handleSearchChange = (event) => {
		this.setState({ searchTerm: event.target.value })
		this.updateGrid()
	}

	// Delete selected items
	handleDeleteClick = (event) => {
		let notSelected = [];
		this.state.items.forEach((item) => {
			if(item.isSelected){
				axios.delete(API_DELETE_ITEM + item.id + "/" + item.createdBy)
					.then(() => {
						this.updateGrid();	// TODO works, but minor delay since you update every delete
					})
			}
			else
				notSelected.push(item);
		})

		// After delete, reset deleteMode and checkboxes
		this.setState({ deleteMode: false, allSelected: false })
	}

	handleEditClick = (event) => {
		if(this.state.editMode){
			// TODO API call to save changes
			this.state.items.forEach((item) => {
				console.log(item)

				// TODO Modified is hardcoded
				let newItem = {
					Content: "[{"
							+ "Id:" + this.state.id + "," 
							+ "Name:'" + this.state.name + "',"
							+ "RecordStatusId:" + this.state.recordStatusId + ","
							+ "CreatedBy:" + this.state.createdBy + ","
							+ "ModifiedBy:1},]"
				}
				
				let config = { "Content-Type": "application/json" }
		
				console.log(newItem)
				axios.post(API_SAVE_ITEMS, newItem, config)
					.then(res => {
						console.log(res);
					})
			})
		}

		this.setState({ editMode: !this.state.editMode })
	}

	handleSelectAllClick = (event) => {
		// Set all items' isSelected field to header checkbox value
		let stateItems = [...this.state.items];
		stateItems.forEach((item) => {
			item.isSelected = event.target.checked;
		})

		// deleteMode will always be enabled when all are selected; and vice-versa
		this.setState({ items: stateItems,
						allSelected: event.target.checked,			
						deleteMode: event.target.checked	})
	}

	handleSelectClick = (clickedItem) => {
		let newDeleteMode = false;
		
		let stateItems = [...this.state.items];
		stateItems.forEach((item) => {
			if(item.id === clickedItem.id)				// Toggle the clicked item's isSelected field
				item.isSelected = !item.isSelected;
			if(item.isSelected)							// At least 1 item selected; enable deleteMode
				newDeleteMode = true;
		})

		this.setState({ items: stateItems, deleteMode: newDeleteMode })
	}

	handleNameChange = (changedItem, newValue) => {
		let stateItems = [...this.state.items];
		
		let index = this.state.items.findIndex(x => x === changedItem);	// Get index of item
		let item = this.state.items[index];								// Copy item
		item.name = newValue;											// Replace name in item
		stateItems[index] = item;										// Replace item in array

		this.setState({ items: stateItems });
	}

	handleRecordStatusIdChange = (changedItem, newValue) => {
		let stateItems = [...this.state.items];

		let index = this.state.items.findIndex(x => x === changedItem);	// Get index of item
		let item = this.state.items[index];								// Copy item
		item.recordStatusId = newValue;									// Replace name in item
		stateItems[index] = item;										// Replace item in array

		this.setState({ items: stateItems });
	}

	handleChangePage = (event, newPage) => {
		this.setState({ pageNum: (newPage + 1) }, () => {
			this.updateGrid()
		})
	}

	handleChangeRowsPerPage = (newRowsPerPage) => {
		this.setState({ numItemsPerPage: newRowsPerPage.target.value }, () => {
			this.updateGrid()
		})
	}

	componentDidMount(){
		// Load Record Status dropdown values via API
		// TODO Combine this with the one in ItemForm.js?
		axios.get(API_GET_RECORD_STATUS_LIST)
		.then(res => {
			this.setState({	recordStatusList: res.data.data })
		})
		
		// Populate grid with items
		this.updateGrid();
	}

	render(){
		return(
			<div>
				<GridButtons
					deleteMode={this.state.deleteMode}
					editMode={this.state.editMode}
					handleSearchChange={this.handleSearchChange}
					handleDeleteClick={this.handleDeleteClick}
					handleEditClick={this.handleEditClick}/>

				{/* TODO Hardcoded padding for bottom */}
				<Container style={{paddingBottom: "100px"}}>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<Checkbox checked={this.state.allSelected} onClick={this.handleSelectAllClick}/>
									</TableCell>
									<TableCell/>
									<TableCell>ID</TableCell>
									<TableCell>Thumb Image</TableCell>
									<TableCell>Name</TableCell>
									<TableCell>Record Status</TableCell>
									<TableCell>Created By</TableCell>
									<TableCell>Modified By</TableCell>
									<TableCell>Date Created</TableCell>
									<TableCell>Date Modified</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{this.state.items.map((item) => (
									<GridItem
										key={item.id}
										item={item}
										onSelectClick={this.handleSelectClick}
										editMode={this.state.editMode}
										recordStatusList={this.state.recordStatusList}
										onNameChange={this.handleNameChange}
										onRecordStatusIdChange={this.handleRecordStatusIdChange}
									/>
								))}
							</TableBody>

							<TableFooter>
								<TableRow>
									<TablePagination
										rowsPerPageOptions={[5, 10, 20, 50, 100]}
										rowsPerPage={this.state.numItemsPerPage}
										page={this.state.pageNum - 1}
										count={this.state.totalNumItems}
										onChangePage={this.handleChangePage}
										onChangeRowsPerPage={this.handleChangeRowsPerPage}
									/>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Container>
			</div>
		)
	}
}

class GridItem extends React.Component{
	onSelectClick = () => {
		this.props.onSelectClick(this.props.item);
	}

	handleNameChange = (event) => {
		this.props.onNameChange(this.props.item, event.target.value)
	}
	
	handleRecordStatusIdChange = (event) => {
		this.props.onRecordStatusIdChange(this.props.item, event.target.value)
	}

	render(){
		return(
				<TableRow key={this.props.item.id}>
					<TableCell>
						<Checkbox checked={this.props.item.isSelected} onClick={this.onSelectClick}/>
					</TableCell>
					<TableCell>
						<Link to={{	pathname: "/form",
									state: {id: this.props.item.id}	}}>
							<Button variant="contained"><CreateIcon/></Button>
						</Link>
					</TableCell>
					<TableCell>{this.props.item.id}</TableCell>
					{(this.props.item.thumbImageUrl !== "")
						?	(<TableCell><img className="thumbnail" src={this.props.item.thumbImageUrl} alt=""/></TableCell>)
						:	(<TableCell><img className="thumbnailPlaceholder" alt=""/></TableCell>)}
					
					{(this.props.editMode)
						?	(<TableCell>
								<TextField variant="outlined" value={this.props.item.name} onChange={this.handleNameChange}/>
							</TableCell>)
						:	(<TableCell>{this.props.item.name}</TableCell>)}
					
					{(this.props.editMode)
						?	(<TableCell>
								<Select
									variant="outlined"
									fullWidth 
									value={this.props.item.recordStatusId}
									onChange={this.handleRecordStatusIdChange}>
									
									{/* Populate dropdown with API values */}
									{ this.props.recordStatusList.map((status) => (
										<MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
									)) }
								</Select>
							</TableCell>)
						:	(<TableCell>{this.props.item.recordStatus}</TableCell>)}
					
					<TableCell>{this.props.item.createdByUser}</TableCell>
					<TableCell>{this.props.item.modifiedByUser}</TableCell>
					<TableCell>{this.props.item.dateCreated}</TableCell>
					<TableCell>{this.props.item.dateModified}</TableCell>
				</TableRow>
				)
		
	}
}

export default Grid;