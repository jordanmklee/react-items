import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

class Grid extends React.Component{
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
					<TableBody>
						<TableRow>
							<TableCell>123</TableCell>
							<TableCell>123</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
        )
    }
}

export default Grid;