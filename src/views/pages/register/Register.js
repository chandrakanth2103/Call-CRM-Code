import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import swal from 'sweetalert2';
import '../styles.css'
import loginData from '../login/object';
import {Row,Col,Card,CardHeader,Button,FormGroup,Input,Label,Form} from 'reactstrap';
import { CCard, CCardBody, CCardHeader, CInputGroup, CRow,CCol,CInput,CForm,CInputGroupPrepend,CInputGroupText,CContainer,CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';

class Register extends Component{
    state={
        fullName:'',
        email:'',
        password:'',
        phone:'',
        companyName:'',
        address:'',
        errors:{},
         
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        })  
    }

    handleBlur=(event)=>{
       
       if(this.FormValidation()){
       }    
    }

    handleSubmit=(event)=>{
        event.preventDefault();
        if(this.FormValidation()){
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'company/registartion',this.state)
        .then(response=>{
            console.log(response)
            this.props.history.push('/login')
            swal.fire({  
                title: 'Success',  
                type: 'success',
                icon:'success',  
                text: 'Your data has been saved.',
            });
        })
        .catch(error=>{
            console.log(error.message)
            swal.fire({  
                title: 'error',  
                type: 'error',
                icon:'error',  
                text: 'Data Already exists..',
            });
        })
        
         }
        else{
          swal.fire({  
            title: 'error',  
            type: 'error',
            icon:'error',  
            text: 'All fields are required.',
          });
        } 
    }

    FormValidation=()=>{
        let formerrors={}
        let formIsValid=true;

        if (this.state.fullName.length==0) {    
            formIsValid = false;    
            formerrors.nameerror= "Name is required.";    
        }

        if (this.state.email.length==0) {    
            formIsValid = false;    
            formerrors.emailerror= "Email id is required.";    
        }    
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {    
    
            formIsValid = false;    
            formerrors.emailerror = "Invalid email Id.";    
        }

        if(this.state.password==0){
            formIsValid=false;
            formerrors.passworderror='Password is required';
        }
        if (this.state.phone==0) {    
            formIsValid = false;    
            formerrors.phonenumbererror= "Phone number is required.";    
        }
        if(this.state.companyName.length==0){
            formIsValid = false;    
            formerrors.companyerror= "Company Name is required."; 
        } 
        if(this.state.address.length==0){
            formIsValid = false;    
            formerrors.addresserror= "Address is required.";
        }        
        this.setState({
            errors:formerrors
        })
        return formIsValid  
    }
    
    render(){
    const {nameerror,emailerror,passworderror,phonenumbererror,companyerror,addresserror}=this.state.errors
    return(
        <CCard className='container'>
            <div className='header' style={{marginLeft:100}}>REGISTRATION</div>
            <CForm onSubmit={this.handleSubmit}>
                <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-user" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput  type='text' 
                                placeholder='UserName'
                                name='fullName'
                                value={this.state.fullName}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                         </CInputGroup>
                         {nameerror ? <p className='errors'>{nameerror}</p>:null}
                    </CCol>
                </CRow>

               <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                @
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput type='text' 
                                placeholder='Email'
                                name='email' 
                                value={this.state.email}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                        </CInputGroup>
                        {emailerror && <p className='errors'>{emailerror}</p>} 
                    </CCol>
                </CRow>
                
                <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                        <CInputGroupPrepend>
                            <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type='password' 
                            placeholder='password'
                            name='password' 
                            value={this.state.password}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                        />    
                        </CInputGroup>
                        {passworderror && <p className='errors'>{passworderror}</p>}
                    </CCol>
                </CRow>
                
                <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-phone" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput type='text' 
                                placeholder='phoneNumber'
                                name='phone' 
                                value={this.state.phone}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                        </CInputGroup>
                        {phonenumbererror && <p className='errors'>{phonenumbererror}</p>}
                    </CCol>
                </CRow>
                <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-user" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput  type='text' 
                                placeholder='CompanyName'
                                name='companyName'
                                value={this.state.companyName}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                        </CInputGroup>
                        {companyerror ? <p className='errors'>{companyerror}</p>:null}
                    </CCol>
                </CRow>

                <CRow style={{marginBottom:15}}>
                    <CCol md={6}>
                        <CInputGroup >
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-user" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput  type='textarea' 
                                placeholder='Address'
                                name='address'
                                value={this.state.address}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                        </CInputGroup>
                        {addresserror ? <p className='errors'>{addresserror}</p>:null}
                    </CCol>
                </CRow>
                <CInputGroup style={{marginBottom:15}}>
                    <CButton style={{marginLeft:100}}type='submit'  outline color='success'>Register</CButton>      
                </CInputGroup>
                <p style={{marginLeft:50}}className='link'>If Already Registered? please <Link to='/login'>Login</Link></p> 
            </CForm>    
        </CCard>   
    )
    }
}
export default Register