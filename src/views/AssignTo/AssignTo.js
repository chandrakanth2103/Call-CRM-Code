import React,{Component} from 'react'
import {Card,CardBody,CardHeader,Row,Col,Button,FormGroup,Label,Input,Popover,PopoverBody} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Select from 'react-select';
import './assignto.css'

class AssignTo extends Component{

    state={
        getAssignedLeads:[],
        popOverFilter:false,
        popOverChangeFilter:false,
        leadFilter:'',
        assignedUser:'',
        assignedTo:'',
        leadFilterOptions:[],
        limit:'',
    }

    componentDidMount(){

        this.displayLeads();

        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'all/company/members/'+companyId)
        .then(response=>{
            //console.log(response)
            let optionsArray=[];
            response.data.data.data.map((option,index)=>{
                optionsArray.push({label:option.fullName,value:option._id})
            })
            this.setState({
                leadFilterOptions:optionsArray
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }

    displayLeads=()=>{
        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/Admin/leads/'+companyId)
        .then(response=>{
            console.log(response)
            this.setState({
                getAssignedLeads:response.data.data.data,
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }

    leadChange=(event)=>{
        console.log(event)
        this.setState({
            leadFilter:event,
        })
    }

    leadChangeFilter=(event)=>{
        this.setState({
            assignedUser:event,
        })
    }

    AssignToChange=(event)=>{
        this.setState({
            assignedTo:event,
        })
    }

    limitChange=(event)=>{
        this.setState({
            limit:event.target.value
        })
    }

    nameFormat=(cell,row)=>{
       return row.leadId != undefined ? row.leadId.lead_name : 'NA';
    }

    phoneFormat=(cell,row)=>{
        return row.leadId != undefined ? row.leadId.phone : 'NA';
    }

    emailFormat=(cell,row)=>{
        return row.leadId != undefined ? row.leadId.email : 'NA';
    }

    assignedToFormat=(cell,row)=>{
        console.log(row.assignedTo)
        return row.assignedTo != undefined ? row.assignedTo[0].fullName : 'NA';
    }

    filteredLead=()=>{
        let userId=this.state.leadFilter.value;
        //console.log(userId);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/assignedleads/'+userId)
        .then(response=>{
            //console.log(response)
            toast.success('Leads Filtered successfully..')
            this.setState({
                getAssignedLeads:response.data.data.data,
                popOverFilter:false,
                leadFilter:'',
            })
        })
        .catch(error=>{
            //console.log(error.response.statusText)
            toast.error(error.response.statusText);
            this.setState({
                popOverFilter:false,
                leadFilter:'',
            })
        })
    }

    changeAssign=()=>{
        var obj={};
        obj.assignedUser=this.state.assignedUser.value;
        obj.limit=parseInt(this.state.limit);
        obj.assignedToUser=this.state.assignedTo.value;
        //console.log(obj);
        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'get/change/assigne/leads/'+companyId,obj)
        .then(response=>{
            console.log(response)
            toast.success('Leads Assigne changed successfully..')
            this.displayLeads()
            this.setState({
            popOverChangeFilter:false,
            assignedUser:'',
            assignedTo:'',
        })
        })
        .catch(error=>{
            //console.log(error)
            toast.error(error.response.statusText);
            this.setState({
                popOverChangeFilter:false,
                assignedUser:'',
                assignedTo:'',
            })
        })
    }

    render(){
        return(
            <div>
                <div>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    style={{ zIndex: "1999" }}
                />
                </div>
                <div>
                    <Row>
                        <Col md={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col>
                                        <h4 style={{float:'left'}}>Assigned To</h4>
                                        <Button onClick={()=>this.setState({popOverChangeFilter:true})} className="btn btn-primary mr-3" style={{float:"right",backgroundColor:"blue",color:"white"}} type="button" id='Popup2'>Change Assignee</Button>
                                        <Popover placement='bottom'isOpen={this.state.popOverChangeFilter} target='Popup2'>
                                            <PopoverBody>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Label htmlFor='assignedUser'><h5>Lead Assigned User</h5></Label>
                                                            <Select name='assignedUser'
                                                                value={this.state.assignedUser}
                                                                onChange={this.leadChangeFilter}
                                                                options={this.state.leadFilterOptions}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label htmlFor='leadChangeFilter'>Limit</Label>
                                                            <Input type='number' onChange={(e)=>this.limitChange(e)}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Label htmlFor='assignedTo'><h5>Lead Assigned User</h5></Label>
                                                            <Select name='assignedTo'
                                                                value={this.state.assignedTo}
                                                                onChange={this.AssignToChange}
                                                                options={this.state.leadFilterOptions}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row >
                                                        <Button style={{marginLeft:180}} onClick={this.changeAssign} type='submit' outline color='primary'>Submit</Button>
                                                    </Row> 
                                            </PopoverBody>
                                        </Popover>
                                        <Button onClick={()=>this.setState({popOverFilter:true})}className="btn btn-primary mr-3" style={{float:"right",backgroundColor:"blue",color:"white"}} type="button" id='Popup1'>Filter</Button>
                                        <Popover placement='bottom' isOpen={this.state.popOverFilter} target='Popup1'>
                                            <PopoverBody>
                                                    <Row>
                                                        <Col md={12}>
                                                        <FormGroup>
                                                            <Label htmlFor='leadFilter'><h5>Lead Assigned User</h5></Label>
                                                            <Select name='leadFilter'
                                                                value={this.state.leadFilter}
                                                                onChange={this.leadChange}
                                                                options={this.state.leadFilterOptions}
                                                            />
                                                        </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row >
                                                        <Button style={{marginLeft:180}} onClick={this.filteredLead} type='submit' outline color='primary'>Submit</Button>
                                                    </Row>   
                                            </PopoverBody>
                                        </Popover>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <BootstrapTable 
                                        data={this.state.getAssignedLeads}
                                        striped
                                        hover
                                        keyField='phone'
                                        pagination
                                    >
                                        <TableHeaderColumn
                                            width='20'
                                            dataField='lead_name'
                                            dataFormat={this.nameFormat}
                                        >
                                            Name
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            width='20'
                                            dataField='phone'
                                            dataFormat={this.phoneFormat}
                                        >
                                            Mobile
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            width='20'
                                            dataField='email'
                                            dataFormat={this.emailFormat}
                                        >
                                            Email
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            width='20'
                                            dataField='assignedTo'
                                            dataFormat={this.assignedToFormat}
                                        >
                                            assignedTo
                                        </TableHeaderColumn>
                                    </BootstrapTable>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
}
export default AssignTo