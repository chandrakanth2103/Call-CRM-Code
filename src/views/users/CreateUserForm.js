import React,{Component} from 'react';
import { Button,Card,CardHeader,CardBody,Label,Input,FormGroup,Col,Row,FormFeedback } from 'reactstrap';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
//import formData from './FormObject';
import swal from 'sweetalert2';
//import getUsers from './Users';
import axios from 'axios';

export default class CreateUserForm extends Component{
    state={
        fullName:'',
        designation:'',
        email:'',
        password:'',
        phone:'',
        address:'',
        userType:'',
        typeOption:[
            {label:'Admin',value:'Admin'},
            {label:'Caller',value:'Caller'},
        ]
    }

    componentDidMount(){
        var id=this.props.match.params.id
        //console.log(id)
        if(id != 'new'){
            axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
            axios.get(process.env.REACT_APP_BACKEND_API_URL+'display/company/member/'+id)
            .then(response=>{
                console.log(response)
                this.setState({
                    fullName:response.data.data.data.fullName,
                    email:response.data.data.data.email,
                    password:response.data.data.data.password,
                    phone:response.data.data.data.phone,
                    designation:response.data.data.data.designation,
                    address:response.data.data.data.address,
                    userType:response.data.data.data.user_type,
                })
            }) 
            .catch(error=>{
                console.log(error)
            })
        }
    }

    schema=()=>{
        return(
        Yup.object().shape({
            fullName:Yup.string().required('Name is required'),
            designation:Yup.string().required('Designation is required'),
            email:Yup.string().email('Invalid Email Id').required('Email is required'),
            password:Yup.string().required('Password is required'),
            phone:Yup.string().required('PhoneNumber is required'),
            address:Yup.string().required('Address is required'),
            userType:Yup.object().required('Select the option'),
        })
        )
    }
    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    onSubmit=(event)=>{
        //console.log(event)
        let obj={};
        obj.fullName=event.fullName;
        obj.email=event.email;
        obj.password=event.password;
        obj.phone=event.phone;
        obj.designation=event.designation;
        obj.address=event.address;
        obj.user_type=event.userType;
        //console.log(obj);
        if(this.props.match.params.id != 'new'){
            axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
            axios.put(process.env.REACT_APP_BACKEND_API_URL+'update/company/member/'+this.props.match.params.id,obj)
            .then(response=>{
                console.log(response)
                this.props.history.push('/users')
                swal.fire({
                    title: 'Success',  
                    type: 'success',
                    icon:'success',  
                    text: 'Your data updated successfull..',
                })
            })
            .catch(error=>{
                console.log(error)
                swal.fire({
                    title: 'error',  
                    type: 'error',
                    icon:'error',  
                    text: error.response.data.message,
                  })
            })
        }
        else{
        let userId=localStorage.getItem('userId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'add/members/company/'+userId,obj)
        .then(response=>{
            console.log(response)
            this.props.history.push('/users')
            swal.fire({
                title: 'Success',  
                type: 'success',
                icon:'success',  
                text: 'Your data has been saved..',
              })
        })
        .catch(error=>{
            console.log(error)
            swal.fire({
                title: 'error',  
                type: 'error',
                icon:'error',  
                text: error.response.data.message,
              })
        })
        }
    }

    userTypeChange=(e)=>{
        console.log(e)
        this.setState({
            userType:e
        })
    }

    render(){
        return(
            <Row>
                <Col lg={12}>
                    <Card> 
                        <CardHeader>
                           <h3> Create User</h3>
                        </CardHeader> 
                        <CardBody>
                            <Formik
                            enableReinitialize={true}
                            initialValues={this.state}
                            validationSchema={this.schema}
                            onSubmit={this.onSubmit}
                            >
                                {({values,errors,touched,handleBlur,handleSubmit})=>(
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='fullName'>FullName :</Label>
                                                    <Input type='text' name='fullName'
                                                    value={values.fullName}
                                                    onBlur={handleBlur}
                                                    onChange={this.handleChange}
                                                    valid={!errors.fullName && touched.fullName}
                                                    invalid={errors.fullName && touched.fullName}
                                                    />
                                                    <FormFeedback>{errors.fullName}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='designation'>Designation :</Label>
                                                    <Input type='text' name='designation'
                                                    value={values.designation}
                                                    onBlur={handleBlur}
                                                    onChange={this.handleChange}
                                                    valid={!errors.designation && touched.designation}
                                                    invalid={errors.designation && touched.designation}
                                                    />
                                                    <FormFeedback>{errors.designation}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='phone'>PhoneNumber :</Label>
                                                    <Input type='text' name='phone'
                                                    value={values.phone}
                                                    onBlur={handleBlur}
                                                    onChange={this.handleChange}
                                                    valid={!errors.phone && touched.phone}
                                                    invalid={errors.phone && touched.phone}
                                                    />
                                                    <FormFeedback>{errors.phone}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='email'>Email :</Label>
                                                    <Input type='email' name='email'
                                                    value={values.email}
                                                    onChange={this.handleChange}
                                                    onBlur={handleBlur}
                                                    valid={!errors.email&& touched.email}
                                                    invalid={errors.email && touched.email}
                                                    />
                                                    <FormFeedback>{errors.email}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='password'>Password :</Label>
                                                    <Input type='password' name='password'
                                                    value={values.password}
                                                    onBlur={handleBlur}
                                                    onChange={this.handleChange}
                                                    valid={!errors.password && touched.password}
                                                    invalid={errors.password && touched.password}
                                                    />
                                                    <FormFeedback>{errors.password}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label htmlFor='address'>Address :</Label>
                                                    <Input type='text' name='address'
                                                    value={values.address}
                                                    onBlur={handleBlur}
                                                    onChange={this.handleChange}
                                                    valid={!errors.address && touched.address}
                                                    invalid={errors.address && touched.address}
                                                    />
                                                    <FormFeedback>{errors.address}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2}>
                                                <FormGroup>
                                                    <Label htmlFor='userType'>User_Type</Label>
                                                    <Select name='userType'
                                                        value={values.userType}
                                                        onChange={this.userTypeChange}
                                                        options={this.state.typeOption}
                                                        invalid={!!errors.userType && touched.userType}
                                                    />
                                                   {touched.userType ? <div style={{color:'#dc3545',fontSize:13}}>{errors.userType}</div> : null}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className='text-center'>
                                            <Col className='text-center'>
                                                <Button  size='lg' type='submit' color='success' style={{width:200}}>Submit</Button>
                                                <Button size='lg' type='reset' color='danger' style={{width:200,marginLeft:10}}>Reset</Button>
                                            </Col>
                                            
                                        </Row>

                                        </Form>
                                )}   
                            </Formik>
                            </CardBody>   
                    </Card>  
                </Col>
                </Row>
        )
    }
}