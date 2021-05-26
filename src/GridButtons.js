import React from "react";

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class GridButtons extends React.Component{
	render(){
		return(
			<Container>
				<div style={{float: "left"}}>
					<TextField id="searchField" label="Search" variant="outlined" />
				</div>
				<div className="buttonContainer" style={{float: "right"}}>
					<Button variant="contained" color="primary">Add</Button>
					<Button variant="contained" color="secondary">Delete</Button>
					<Button variant="contained">Edit</Button>
				</div>
			</Container>
		)
	}
}

export default GridButtons;