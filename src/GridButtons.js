import React from "react";

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Link } from "react-router-dom";

function GridButtons(props){
	return(
		<Container className="paperContainer">
			<Paper style={{ overflow: "hidden", padding: "10px" }}>
				
				<div style={{float: "left"}}>
					<TextField id="searchField" label="Search" variant="outlined"
						onChange={props.handleSearchChange}/>
				</div>
				
				<div className="buttonContainer" style={{float: "right"}}>
					{(!props.editMode)
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
					
					
					{(props.deleteMode && !props.editMode)
						?	(<Button variant="contained" color="secondary" size="large"
								onClick={props.handleDeleteClick}>
								Delete
							</Button>)
						:	(<Button variant="contained" color="secondary" size="large" disabled>
								Delete
							</Button>)}


					{(props.editMode)
						?	(<Button variant="contained" size="large" color="primary"
								onClick={props.handleEditClick}>
								Save
							</Button>)
						:	(<Button variant="contained" size="large"
								onClick={props.handleEditClick}>
								Edit
							</Button>)}	
				</div>

			</Paper>
		</Container>
	)
}

export default GridButtons;