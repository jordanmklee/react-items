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
				<ul className="buttonContainer" style={{float: "right"}}>
					<li>
						<Button variant="contained" color="primary">Add</Button>
					</li>
					<li>
						<Button variant="contained" color="secondary">Delete</Button>
					</li>
					<li>
						<Button variant="contained">Edit</Button>
					</li>
				</ul>
			</Container>
		)
	}
}

export default GridButtons;