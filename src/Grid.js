import React from 'react';

import Paper from '@material-ui/core/Paper';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import axios from "axios";
const API_GET_ITEMS = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getitems/";

class Grid extends React.Component{
    state = {
		items: [],

		numItemsPerPage: 20,
		pageNum: 1,
	}

    // Update grid items via API
    updateGrid(numItems, itemPage){
        axios.get(API_GET_ITEMS + numItems + "/" + itemPage)
            .then(res => {
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
            
                this.setState({items: newItemsState});
            })
    }
	
    // Populate grid with items
	componentDidMount(){
        this.updateGrid(this.state.numItemsPerPage, this.state.pageNum);
	}

    render(){
        return(
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
				</Table>
			</TableContainer>
        )
    }
}

export default Grid;