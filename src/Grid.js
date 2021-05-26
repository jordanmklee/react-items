import React from 'react';
import GridButtons from "./GridButtons"

import Paper from '@material-ui/core/Paper';

import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import axios from "axios";
const API_GET_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitems/";

class Grid extends React.Component{
	state = {
		items: [],

		totalNumItems: 0,
		numItemsPerPage: 20,
		pageNum: 1,
	}

	// Update grid items via API
	updateGrid(numItems, itemPage){
		axios.get(API_GET_ITEMS + numItems + "/" + itemPage)
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
					})
				})
			
				this.setState({ items: newItemsState, totalNumItems: newTotalNumItems });
			})
	}
	
	handleChangePage = (event, newPage) => {
		this.setState({ pageNum: (newPage + 1) }, () => {
			this.updateGrid(this.state.numItemsPerPage, this.state.pageNum)
		})
	}

	handleChangeRowsPerPage = (newRowsPerPage) => {
		this.setState({ numItemsPerPage: newRowsPerPage.target.value }, () => {
			this.updateGrid(this.state.numItemsPerPage, this.state.pageNum)
		})
	}

	// Populate grid with items
	componentDidMount(){
		this.updateGrid(this.state.numItemsPerPage, this.state.pageNum);
	}

	render(){
		return(
			<div>
				<GridButtons/>
				
				{/* TODO Hardcoded padding for bottom */}
				<Container style={{paddingBottom: "100px"}}>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
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

							{/* TODO Replace with ThumbImageURL */}
							<TableBody>
								{this.state.items.map((item) => (
									<TableRow key={item.id}>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.recordStatus}</TableCell>
										<TableCell>{item.createdBy}</TableCell>
										<TableCell>{item.modifiedBy}</TableCell>
										<TableCell>{item.dateCreated}</TableCell>
										<TableCell>{item.dateModified}</TableCell>
									</TableRow>
									)
								)}
								
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

export default Grid;