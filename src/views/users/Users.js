import React ,{Component} from 'react';
import {Button,Card,CardHeader,CardBody} from 'reactstrap';
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
//import 'bootstrap/dist/css/bootstrap.css';
import formData from './FormObject';
import CIcon from '@coreui/icons-react'
import axios from 'axios';

export default class Users extends Component{

    state={
        getUsers:[],
        data:[],
    }

    componentDidMount(){
        let companyId=localStorage.getItem('companyId')
        console.log(companyId);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'all/company/members/'+companyId)
        .then(response=>{
            console.log(response.data.data.data)
            // let usersArray=[];
            // response.data.data.data.map((data,index)=>{
            //     //console.log(data._id)
            //     usersArray.push({   
            //         id:data._id,
            //         sno:index+1,
            //         fullName:data.fullName,
            //         email:data.email,
            //         password:data.password,
            //         designation:data.designation,
            //         phone:data.phone,
            //         address:data.address
            //     })
            //})
            this.setState({
                getUsers:response.data.data.data
            }
            //,()=>{console.log(this.state.getUsers)}
            )
        })
        .catch(error=>{
            console.log(error)
        })
    }

    openUserForm=()=>{
        this.props.history.push('/createuserform/new')
    }

    updateUserForm=(cell,row)=>{
        console.log(row._id)
        this.props.history.push('/createuserform/'+row._id)
    }

    editFormat=(cell,row)=>{
        //console.log(row)
        return(
            <CIcon name="cil-user" onClick={()=>this.updateUserForm(cell,row)} />
        )
    }

    indexFormat=(cell,row,enumObject,index)=>{
        return (<div>{index+1}</div>)
    }

    render(){
        return(
            <Card>
                <CardHeader className='text-right'>
                    <Button color='primary' onClick={this.openUserForm}>Create User</Button>
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                    data={this.state.getUsers}
                    keyField='sno'
                    striped
                    hover
                    pagination
                    >
                        <TableHeaderColumn
                        dataField="sno"
                        width="20"
                        dataFormat={this.indexFormat}
                        >
                      S.NO
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='fullName'
                        width='20'
                        >
                            FullName
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='designation'
                        width='20'
                        >
                            Designation
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='email'
                        width='20'
                        >
                            Email
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='phone'
                        width='20'
                        >
                            PhoneNumber
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='address'
                        width='20'
                        >
                            Address
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                        dataField='action'
                        width='20'
                        dataFormat={this.editFormat}
                        >
                            Action
                        </TableHeaderColumn>

                    </BootstrapTable>
                </CardBody>
            </Card>
            
        )
    }
}
