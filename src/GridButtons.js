import React from "react";

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Link } from "react-router-dom";

class GridButtons extends React.Component{
	render(){
		return(
			<Container>
				<div >
					<div style={{float: "left"}}>
						<TextField id="searchField" label="Search" variant="filled" />
					</div>
					<div className="buttonContainer" style={{float: "right", backgroundColor: "black"}}>
						<Link to={{	pathname: "/form",
									state: {id: 0}	}}>
							<Button variant="contained" color="primary">Add</Button></Link>
						<Button variant="contained" color="secondary" onClick={this.props.handleDeleteClick}>Delete</Button>
						<Button variant="contained" onClick={this.props.handleEditClick}>Edit</Button>
					</div>
				</div>
			</Container>
		)
	}
}

export default GridButtons;