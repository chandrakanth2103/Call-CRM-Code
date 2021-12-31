import React,{Component} from 'react';
import {Card,CardHeader,CardBody,Row,Col,Button,Label,Input,FormGroup,FormFeedback} from 'reactstrap';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
//import { AppSwitch } from '@coreui/react';
import Switch from "react-switch";
import RoleData from './RoleObject';
import swal from 'sweetalert2';

class CreateRoleForm extends Component{
    state={
        roleName:'',
        initialRoles:[
            {menu:'Select All', id:0},
            {menu:'DashBoard',id:1},
            {menu:'Users', id:2},
            {menu:'Permissions',id:3},
        ],
        updatedRoles:[],
        //createRoles:[],
    }

    componentDidMount(){
        var roleName=this.props.match.params.roleName;
        if(roleName != 'new'){
        RoleData.map(value=>{
            if(roleName==value.roleName){
                 this.setState({
                    updatedRoles:value.data,
                    roleName:value.roleName
                })
            }
        })    
        }
         else{
        var setRoles=[];
        this.state.initialRoles.map((RoleArray,index)=>{
            setRoles.push({id:RoleArray.id,
                [RoleArray.menu]:{
                    canView:false,
                    canCreate:false,
                    canUpdate:false,
                    canDelete:false,
                }
            })
        })
        this.setState({
            updatedRoles:setRoles
        }
        )  
    }
    }
    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    schema=()=>{
        return(
            Yup.object().shape({
                roleName:Yup.string().required('RoleName is required')
            })
        )
    }
    onSubmit=(values)=>{
            let obj={};
            let array=[];
            obj.roleName=values.roleName;
            this.state.initialRoles.map((val,index)=>{
            array.push({[val.menu]: this.state.updatedRoles[index][val.menu]});
            });
            //console.log(array)
            obj.data=array
            //console.log(obj);
                RoleData.push(obj);
            console.log(RoleData)
            //console.log(this.state.roleDetails)
            if(this.schema){
                this.props.history.push('/roles')
                swal.fire({
                    type:'success',
                    title:'success',
                    icon:'success',
                    text:'Your data is saved..'
                })
             }

    }

    roleChangeHandler=(row,toggle,object)=>{
        // var roleName=this.props.match.params.roleName;
        // console.log(roleName)
        // if(roleName != 'new'){
        //     //console.log(this.state.updatedRoles)
        //     //console.log(RoleData)
        //     var ArrayData=[];
        //     RoleData.map((data,index)=>{
        //         if(roleName==data.roleName){
        //         //console.log(data.data)
        //         ArrayData.push(data.data)
        //         //console.log(ArrayData)
        //         this.setState({
        //             updatedRoles:ArrayData
        //         },()=>{console.log(this.state.updatedRoles)})
        //         }
        //     })
        // }
        // else{
        var changeRole=this.state.updatedRoles
        //var changeRole= [
        //                 {id:0,
        //                     'Select All':{
        //                         CanView:false,
        //                         CanCreate:false,
        //                         CanUpdate:false,
        //                         CanDelete:false,
        //                     },
        //                 },
        //                 {id:1,
        //                     'DashBoard':{
        //                         CanView:false,
        //                         CanCreate:false,
        //                         CanUpdate:false,
        //                         CanDelete:false,
        //                     },
        //                 },
        //                 {id:2,
        //                     'Users':{
        //                         CanView:false,
        //                         CanCreate:false,
        //                         CanUpdate:false,
        //                         CanDelete:false,
        //                     },
        //                 },
        //                 {id:3,
        //                     'Permissions':{
        //                         CanView:false,
        //                         CanCreate:false,
        //                         CanUpdate:false,
        //                         CanDelete:false,
        //                     },
        //                 },
        //                ]
        console.log(RoleData);
        if(row.menu=='Select All'){ 
            this.state.initialRoles.map((data,index)=>{
                //console.log(data)
                //console.log(changeRole[index][data.menu])
                changeRole[index][data.menu][object]= !toggle;
            })
            this.setState({
                updatedRoles:changeRole
            }
            ,()=>{console.log(this.state.updatedRoles)}
            )
        }
        else{ 
            //console.log(changeRole)
            changeRole[row.id][row.menu][object] = !this.state.updatedRoles[row.id][row.menu][object]
            if(changeRole[row.id][row.menu][object]==false){
                changeRole[0]['Select All'][object]=false
            }
            this.setState({
                updatedRoles:changeRole
            }
            ,()=>{console.log(this.state.updatedRoles)}
            )
        }
        //console.log(changeRole,this.state.updatedRoles)
    //}
}

    roleFormattedData=(cell,row,object)=>{
        //console.log(this.state.updatedRoles)
        //console.log(object)
        var toggle=this.state.updatedRoles[row.id] != undefined ? this.state.updatedRoles[row.id][row.menu][object] : false;
        return(<Switch
        checked={toggle}
        onChange={()=>this.roleChangeHandler(row,toggle,object)}
       />)
    }
    render(){
        return(
            <div>
                <Card>
                    <CardBody>
                        <Formik
                        enableReinitialize={true}
                        initialValues={this.state}
                        validationSchema={this.schema}
                        onSubmit={this.onSubmit}
                        render =
                            {({errors,
                            touched,
                            handleBlur,
                            handleSubmit,
                            values})=>(
                                 <Form onSubmit={handleSubmit}>
                                 <Row style={{marginBottom:'10px'}}>
                                     <Col md={4}>
                                         <FormGroup>
                                             <Label htmlFor='roleName'>Role*</Label>
                                             <Input type='text' name='roleName'
                                             value={values.roleName}
                                             onChange={this.handleChange}
                                             onBlur={handleBlur}
                                             invalid={errors.roleName && touched.roleName}
                                             valid={!errors.roleName && touched.roleName} 
                                             />
                                             <FormFeedback>{errors.roleName}</FormFeedback>
                                         </FormGroup>
                                     </Col>
                                 </Row>
                                 <BootstrapTable keyField='menu'
                                 data={this.state.initialRoles}
                                 //striped
                                 hover
                                 bordered={false}
                                 >
                                     <TableHeaderColumn
                                     dataField='menu'
                                     >
                                         Menu
                                     </TableHeaderColumn>
                                     <TableHeaderColumn
                                     dataField='view'
                                     dataFormat={this.roleFormattedData}
                                     formatExtraData='canView'
                                     >
                                         View
                                     </TableHeaderColumn>
                                     <TableHeaderColumn
                                     dataField='create'
                                     dataFormat={this.roleFormattedData}
                                     formatExtraData='canCreate'
                                     >
                                         Create
                                     </TableHeaderColumn>
                                     <TableHeaderColumn
                                     dataField='update'
                                     dataFormat={this.roleFormattedData}
                                     formatExtraData='canUpdate'
                                     >
                                         Update
                                     </TableHeaderColumn>
                                     <TableHeaderColumn
                                     dataField='delete'
                                     dataFormat={this.roleFormattedData}
                                     formatExtraData='canDelete'
                                     >
                                         Delete
                                     </TableHeaderColumn>
                                 </BootstrapTable>
                                 <Row className='text-center' style={{marginTop:15}}>
                                     <Col className='text-center'>
                                         <Button style={{width:200}} size='lg' type='reset' outline color='danger'>Cancel</Button>
                                         <Button type='submit' style={{width:200,marginLeft:10}} size='lg' outline color='success'>Submit</Button>

                                     </Col>
                                 </Row>
                             </Form>

                            )}/>
                           
                    
                    </CardBody>
                </Card>
                </div>
        )
    }
}
export default CreateRoleForm