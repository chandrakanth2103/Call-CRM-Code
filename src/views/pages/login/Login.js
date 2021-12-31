import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import '../styles.css'
import loginData from './object';
import swal from 'sweetalert2';
import formData from 'src/views/users/FormObject';
import { CCard,CCol,CForm,CInput,CInputGroup,CInputGroupPrepend,CInputGroupText,CRow,CButton} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';


class Login extends Component{

  state={
    password:'',
    phone:'',
    errors:{},
  }

  handleChange=(event)=>{
      this.setState({
      [event.target.name]:event.target.value
    }) 
  }

  handleSubmit=(event)=>{
    event.preventDefault();
    var login={
      phone:this.state.phone,
      password:this.state.password
    }
    if(this.formValidation()){
      //axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken');
      axios.post(process.env.REACT_APP_BACKEND_API_URL+'company/user/login',login)
      .then(response=>{
        console.log(response)
        //console.log(response.data.data.user._id);
        setTimeout(()=>{
          if(response.data.status==200){
            localStorage.setItem('cktoken',response.data.data.token);
            localStorage.setItem('companyId',response.data.data.user.company._id);
            localStorage.setItem('userId',response.data.data.user._id);
            //console.log(localStorage.getItem('userId'))
          }
          this.props.history.push('/home')
          swal.fire({
            title: 'Success',  
            type: 'success',
            icon:'success',  
            text: 'Login successfull.',
          })
        },1500)
      })
      .catch(error=>{
        console.log(error.message)
        swal.fire({
          title: 'error',  
          type: 'error',
          icon:'error',  
          text: error.response.data.message,
        })
      })
    }    
  }

  handleBlur=(event)=>{
    if(this.formValidation()){
    }
  }

  formValidation=()=>{
    let loginerrors={};
    let loginIsValid=true;
    if(this.state.phone==0){
      loginIsValid=false;
      loginerrors.phoneerror='PhoneNumber is required';
    }
    if(this.state.password==0){
      loginIsValid=false;
      loginerrors.passworderror='Password is required';
    }
    this.setState({
      errors:loginerrors
    })
    return loginIsValid
    }
  
  render(){
    const {phoneerror,passworderror}=this.state.errors
    return(
      <CCard className='container'>
        <div className='header' style={{marginLeft:150}}> LOGIN</div><br/>
        <CForm onSubmit={this.handleSubmit}>
          <CRow style={{marginBottom:15}}>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupPrepend>
                  <CInputGroupText>
                    <CIcon name="cil-phone" />
                  </CInputGroupText>
                </CInputGroupPrepend>
                <CInput type='text' name='phone'
                  placeholder="PhoneNumber"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                />
              </CInputGroup>
              {phoneerror ? <p className='errors'>{phoneerror}</p>:null}
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
                <CInput type='password' name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                />
              </CInputGroup>
              {passworderror ? <p className='errors'>{passworderror}</p>:null}
            </CCol>
          </CRow>
            <CButton style={{marginLeft:140}}type='submit' outline color='success'>Login</CButton><br/>
            <p style={{marginLeft:100}} className='link'>If not having account ?<Link to='/register'>Register</Link></p>
        </CForm>
      </CCard>  
    )
  }
}
export default Login