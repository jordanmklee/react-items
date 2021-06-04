import React from "react";

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Link } from "react-router-dom";

class GridButtons extends React.Component{
	render(){
		return(
			<Container className="paperContainer">
				<Paper style={{ overflow: "hidden", padding: "10px" }}>
					
					<div style={{float: "left"}}>
						<TextField id="searchField" label="Search" variant="outlined"
							onChange={this.props.handleSearchChange}/>
					</div>
					
					<div className="buttonContainer" style={{float: "right"}}>
						{(!this.props.editMode)
							?	(<Link to={{
									pathname: "/items/form",
									state: { id: 0 } }}>
									<Button variant="contained" color="primary" size="large">
										Add
									</Button>
								</Link>)
							:	(<Button variant="contained" color="primary" size="large" disabled>
									Add
								</Button>)}
						
						
						{(this.props.deleteMode && !this.props.editMode)
							?	(<Button variant="contained" color="secondary" size="large"
									onClick={this.props.handleDeleteClick}>
									Delete
								</Button>)
							:	(<Button variant="contained" color="secondary" size="large" disabled>
									Delete
								</Button>)}


						{(this.props.editMode)
							?	(<Button variant="contained" size="large" color="primary"
									onClick={this.props.handleEditClick}>
									Save
								</Button>)
							:	(<Button variant="contained" size="large"
									onClick={this.props.handleEditClick}>
									Edit
								</Button>)}	
					</div>

				</Paper>
			</Container>
		)
	}
}

export default GridButtons;