import React from "react";

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import axios from "axios";
const API_GET_RECORD_STATUS_LIST = "https://bimiscwebapi-test.azurewebsites.net/api/misc/getrecordstatuslistforitems/";

class ItemForm extends React.Component{
    state = {
        recordStatusList: [],
        
        name: "",
        recordStatusId: "",
        imageUrls: [],
    }
    
    handleRecordStatusIdChange = (event) => {
        this.setState({ recordStatusId: event.target.value })
    }

    componentDidMount(){
        // Load API values for Record Status dropdown
        axios.get(API_GET_RECORD_STATUS_LIST)
            .then(res => {
                this.setState({ recordStatusList: res.data.data })
            })
    }
    
    render(){
        // TODO Hardcoded 500px width for form
        return(
            <Container style={{width: "500px"}}><Paper>
                    <div className="formContainer">
                        <h1>Edit Item {this.props.location.state.id}</h1>
                        
                        <div className="inputContainer">
                            <TextField label="Name" variant="outlined" fullWidth></TextField>
                        </div>
                        <div className="inputContainer">
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Record Status</InputLabel>
                                <Select
                                value={this.state.recordStatusId}
                                onChange={this.handleRecordStatusIdChange}
                                variant="outlined"
                                label="Record Status"
                                fullWidth>
                                    { this.state.recordStatusList.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                                    )) }
                                </Select>
                            </FormControl>

                            <p>image placeholder</p>

                            <div className="buttonContainer">
                                <Button variant="contained">Back</Button>
                                <Button variant="contained" color="primary">Save</Button>
                            </div>
                        </div>
                    </div>
                </Paper></Container>
        )
    }
}

export default ItemForm;