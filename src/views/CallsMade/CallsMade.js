import React,{Component} from 'react'
import {Card,CardBody,CardHeader,Row,Col,Button,FormGroup,Label,Input} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Select from 'react-select'
import {Popover,PopoverHeader,PopoverBody} from 'reactstrap'
import moment from "moment";
import './callsmade.css';

class CallsMade extends Component{

    state={
        getCallsMade:[],
        popOverFilter:false,
        assignedTo:'',
        callsMadeFilterOptions:[],
        phoneNumber:'',
        callDate:'',
    }

    componentDidMount(){

        this.CallsMadeData();

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
                callsMadeFilterOptions:optionsArray
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }

    callsMadeChange=(event)=>{
        //console.log(event)
        this.setState({
            assignedTo:event
        })
    }

    phoneChange=(event)=>{
        //console.log(event)
        this.setState({
            phoneNumber:event.target.value
        })
    }

    callDateChange=(event)=>{
        //console.log(event.target.value)
        this.setState({
            callDate:event.target.value
        })
    }

    CallsMadeData=()=>{
        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/project/callmadeleads/'+companyId)
        .then(response=>{
            console.log(response)
                this.setState({
                    getCallsMade:response.data.data.data
                })
        })
        .catch(error=>{
            console.log(error)
        })
    }   

    filterCalls=()=>{
        let obj={};
        obj.phone=this.state.phoneNumber;
        obj.assignedTo=this.state.assignedTo.value;
        obj.callDate=this.state.callDate;
        //console.log(obj);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'callsmade/filter',obj)
        .then(response=>{
            console.log(response)
            //this.CallsMadeData();
            if(response.data.data.data.length != 0){
                toast.success('Your Data is Filtered successfully..')
                this.setState({
                    getCallsMade:response.data.data.data,
                    popOverFilter:false,
                    assignedTo:'',
                    callDate:'',
                    phoneNumber:'',
                })
            }
            else{
                toast.error('Data not found..')
                this.setState({
                    getCallsMade:[],
                    popOverFilter:false,
                    assignedTo:'',
                    callDate:'',
                    phoneNumber:'',
                })
            }
            
        })
        .catch(error=>{
            console.log(error)
            toast.error(error.response.statusText);
            this.setState({
                getCallsMade:[],
                popOverFilter:false,
                assignedTo:'',
                callDate:'',
                phoneNumber:'',
            })
        })
    }

    indexFormat=(cell,row,enumObject,index)=>{
        //console.log(index);
        return(<div>{index+1}</div>)
    }

    nameFormat=(cell,row)=>{
        return (
            <a style={{cursor:'pointer'}} onClick={()=>this.openLeadPage(cell,row)}>{row.leadId.lead_name}</a>
        )
    }

    openLeadPage=(cell,row)=>{
        console.log(row.leadId._id)
        return (
            this.props.history.push('/createleads/'+row.leadId._id)
        )
    }

    emailFormat=(cell,row)=>{
        return row.leadId != undefined ? row.leadId.email : 'NA';
    }

    phoneFormat=(cell,row)=>{
        return row.leadId != undefined ? row.leadId.phone : 'NA'; 
    }

    resultFormat=(cell,row)=>{
        return row.result != undefined ? row.result.name : 'NA';
    }

    subResultFormat=(cell,row)=>{
        return row.subResult != undefined ? row.subResult[0].value : 'NA';
    }

    createdAtFormat=(cell,row)=>{
        return row.leadId != undefined ? moment(row.leadId.createdAt).format('YYYY-MM-DD') : 'NA';
    }

    assignedToFormat=(cell,row)=>{
        return row.assignedTo != undefined ? row.assignedTo.fullName : 'NA';
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
                                    <h4 style={{float:'left'}}>Calls Made</h4>
                                    <Button onClick={()=>this.setState({popOverFilter:true})}className="btn btn-primary mr-3" style={{float:"right",backgroundColor:"blue",color:"white"}} type="button" id='Popup1'>Filter</Button>
                                    <Popover placement='bottom' isOpen={this.state.popOverFilter}  target='Popup1'>
                                        <PopoverBody>
                                                <Row>
                                                    <Col md={12}>
                                                    <FormGroup>
                                                        <Label htmlFor='assignedTo'><h6>Select User</h6></Label>
                                                        <Select name='assignedTo'
                                                            value={this.state.assignedTo}
                                                            onChange={this.callsMadeChange}
                                                            options={this.state.callsMadeFilterOptions}
                                                        />
                                                    </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Label htmlFor='phoneNumber'><h6>Phone Number</h6></Label>
                                                            <Input type='text' name='phoneNumber' onChange={(e)=>this.phoneChange(e)}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Label htmlFor='callDate'><h6>Call Date</h6></Label>
                                                            <Input type='date' name='callDate' onChange={(e)=>this.callDateChange(e)}/>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row >
                                                    <Button style={{marginLeft:180}} onClick={this.filterCalls} type='submit' outline color='primary'>Submit</Button>
                                                </Row>   
                                        </PopoverBody>
                                    </Popover>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <BootstrapTable 
                                    data={this.state.getCallsMade}
                                    striped
                                    hover
                                    keyField='sno'
                                    pagination
                                >
                                    <TableHeaderColumn
                                        width='10'
                                        dataField='sno'
                                        dataFormat={this.indexFormat}
                                    >
                                        S No
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='20'
                                        dataField='lead_name'
                                        dataFormat={this.nameFormat}
                                    >
                                        Name
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='15'
                                        dataField='phone'
                                        dataFormat={this.phoneFormat}
                                    >
                                        Mobile
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='25'
                                        dataField='email'
                                        dataFormat={this.emailFormat}
                                    >
                                        Email
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='15'
                                        dataField='result'
                                        dataFormat={this.resultFormat}
                                    >
                                        Result
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='20'
                                        dataField='subResult'
                                        dataFormat={this.subResultFormat}
                                    >
                                        Sub Result
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='15'
                                        dataField='assignedTo'
                                        dataFormat={this.assignedToFormat}
                                    >
                                        Assigned To
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='15'
                                        dataField='createdAt'
                                        dataFormat={this.createdAtFormat}
                                    >
                                        Call Date
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
export default CallsMade