import React,{Component} from 'react';
import {Card,CardBody,CardHeader,Row,Col,Button} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import CIcon from '@coreui/icons-react'

class LeadsTable extends Component{

    state={
        getLeads:[]
    }

    componentDidMount(){
        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/leads/'+companyId)
        .then(response=>{
            console.log(response)
                 this.setState({
                     getLeads:response.data.data.data
                 })
        })
        .catch(error=>{
            console.log(error)
        })
    }

    indexFormat=(cell,row,enumObject,index)=>{
        return (<div>{index+1}</div>)
    }

    addLead=()=>{
        this.props.history.push('/createleads/new')
    }

    importLead=()=>{
        this.props.history.push('/importleads');
    }

    editFormat=(cell,row)=>{
        return(
            <i href='#' onClick={()=>this.updateLeads(cell,row)} style={{cursor:'pointer'}}>Edit</i>
        )
    }

    updateLeads=(cell,row)=>{
        console.log(row._id)
        this.props.history.push('/createleads/'+row._id)
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
                                        <h4 style={{float:'left'}}>Leads</h4>
                                        <Button className="btn btn-primary mr-3" style={{float:"right",backgroundColor:"blue",color:"white"}} type="button" onClick={this.importLead} >Import Lead</Button>
                                        <Button className="btn btn-primary mr-3" style={{float:"right",backgroundColor:"blue",color:"white"}} type="button" onClick={this.addLead}>Create Lead</Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <BootstrapTable 
                                        data={this.state.getLeads}
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
                                            dataField='action'
                                            dataFormat={this.editFormat}
                                        >
                                            Action
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
export default LeadsTable