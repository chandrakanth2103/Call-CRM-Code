import React,{Component} from 'react';
import {Card,CardHeader,CardBody,Button,Row,Col} from 'reactstrap';
import {TableHeaderColumn,BootstrapTable} from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import RoleData from './RoleObject';
import CIcon from '@coreui/icons-react'
import moment from 'moment';

class Roles extends Component{

    state={
       
        getRoles:[],
        Date:new Date().toISOString().slice(0,10)
    }

    componentDidMount(){
       //console.log(RoleData)
       this.setState({
           getRoles:RoleData
       })
    }

    roleFormat=(cell,row)=>{
        //console.log(row.roleName)
        return row.roleName ? row.roleName : 'NA';
    }

    createdDate=(cell,row)=>{
        //console.log(row.date)
        return row.roleName ? this.state.Date : "n";
    }

    createRoleForm=()=>{
        this.props.history.push('/createroleform/new')
    }

    updateRole=(cell,row)=>{
        //console.log(row.roleName)
        return(
        this.props.history.push('/createroleform/'+row.roleName)
        )
    }

    actionFormat=(cell,row)=>{
        return(
            
            <CIcon name='cil-user' onClick={()=>this.updateRole(cell,row)}/>
           
        )
    }

   
    render(){
        return(
            
            <Card>
                <CardHeader className='text-right'>
                    <Button color='primary' onClick={()=>this.createRoleForm()}>Create Role</Button>
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                    data={this.state.getRoles}
                    keyField='roleName'
                    striped
                    hover
                    >
                       
                        <TableHeaderColumn
                        dataField='roleName'
                        dataFormat={this.roleFormat}
                        >
                            RoleName
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='date'
                        dataFormat={this.createdDate}>
                            Created Date
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='action'
                        dataFormat={this.actionFormat}>
                            Action
                        </TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
           
        )
    }
}
export default Roles