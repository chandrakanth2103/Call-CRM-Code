import React,{Component} from 'react';
import {Card,CardBody,CardHeader,Row,Col,Button,Input,FormGroup,Label,FormFeedback} from 'reactstrap';
import Select from 'react-select';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import CIcon from '@coreui/icons-react'
import { Accordion } from 'react-bootstrap';

class CreateLead extends Component{
    state={
        name:'',
        email:'',
        phoneNumber:'',
        address:'',
        assignedTo:'',
        options:[],
        extraObject:[],
        resultObject:[],
        resultName:'',
        resultOptions:[],
        createData:'',
        updateData:'',
        leadLogDataId:'',
        resultFormData:[],
        extraField:[],
        extraFieldCheckBoxArray:[],
        extraFieldRadioButtonArray:[],
        subResult:[],
        checkBoxArray:[],
        id:'',
        leadsLogData:'',
        checkbox:false,
        leadActivity:[],
    }

    componentDidMount(){

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
                options:optionsArray
            })
        })
        .catch(error=>{
            console.log(error)
        })

        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/custom/forms')
        .then(response=>{
            //console.log(response)
            let data='';
            response.data.data.data.map((result)=>{
                data=result;
            })
            data.extrafieldObject.map((value)=>{
                this.state.extraObject.push(value)
            })
            this.setState({
                extraObject:data.extrafieldObject,
            })
            this.setState({
              resultFormData:data.formObject,
            })
        })
        .catch(error=>{
            console.log(error)
        })

        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/result/'+companyId)
        .then(response=>{
            //console.log(response)
            let resultArray=[];
            response.data.data.data.map((val)=>{
                resultArray.push({label:val.name,value:val._id})
            })
            this.setState({
                resultOptions:resultArray
            })
        })
        .catch(error=>{
            console.log(error)
        })

        if(this.props.match.params.id != 'new'){
            this.componentData(this.props.match.params.id)
            this.setState({
                id:this.props.match.params.id,
            }
            //,()=>{console.log(this.state.id)}
            )
        }

        // if(this.props.match.params.id != 'new'){
        //     axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        //     axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/lead/'+this.props.match.params.id)
        //     .then(response=>{
        //         console.log(response)
        //     })
        //     .catch(error=>{
        //         console.log(error)
        //     })
        // }
    }

    schema=()=>{
        return (
            Yup.object().shape({
                name:Yup.string().required('Lead Name is required'),
                phoneNumber:Yup.string().required('PhoneNumber is required'),
                email:Yup.string().email('Invalid email').required("Email is required"),
                address:Yup.string().required('Address is required'), 
                assignedTo:Yup.object().required('Select the option'),
            })
        )
    }

    componentData=(leadId)=>{
        localStorage.getItem('companyId')
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/lead/'+leadId)
        .then(response=>{
            console.log(response)
                this.setState({
                    leadActivity:response.data.data.leadActivity,
                    updateData:response,
                    name:response.data.data.data.lead_name,
                    email:response.data.data.data.email,
                    phoneNumber:response.data.data.data.phone,
                    address:response.data.data.data.address,
                    assignedTo:response.data.data.data.assignedTo ?{label:response.data.data.data.assignedTo.fullName,value:response.data.data.data.assignedTo._id} : null,
                    leadLogDataId:response.data.data.leadsLogData ? response.data.data.leadsLogData._id : null ,
                    subResult:response.data.data.leadsLogData ? response.data.data.leadsLogData.subResult : null,
                    extraField:response.data.data.data.extraFormObject,
                    leadsLogData:response.data.data.leadsLogData,
                }
                ,()=>{console.log(this.state.leadsLogData,this.state.updateData,this.state.createData,this.state.leadLogDataId)}
                )
        })
        .catch(error=>{
            console.log(error)
        })
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    userChange=(event)=>{
        console.log(event)
        this.setState({assignedTo:event})
    }

    resultChange=(e)=>{
        if(e != null){
        this.state.resultFormData.map((data)=>{ if(data.resultId==e.value){console.log(data)
           this.setState({
               subResultData:data.taskData,
               resultName:e
           })
        }});
    }
    }

    reset=()=>{
        this.props.history.push('/leadstable');
    }

    onSubmit=(values)=>{
        //console.log(values)
        let userId=localStorage.getItem('userId');
        let companyId=localStorage.getItem('companyId');
        let obj={};
        obj.lead_name=values.name;
        obj.extraFormObject=this.state.extraField;
        obj.phone=values.phoneNumber;
        obj.email=values.email;
        obj.address=values.address;
        obj.assignedTo=values.assignedTo.value;
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        if(this.state.id != '' && this.state.id != 'new'){
            axios.put(process.env.REACT_APP_BACKEND_API_URL+'update/only/lead/'+this.state.id,obj)
            .then(response=>{
                console.log(response)
                toast.success('Your data updated successfully..')
            })
            .catch(error=>{
                console.log(error)
                toast.error(error.response.statusText)
            })
        }
        else{
            axios.post(process.env.REACT_APP_BACKEND_API_URL+'create/new/lead/'+companyId+'/'+userId,obj)
            .then(response=>{
                console.log(response)
                toast.success('Your data is saved')
                this.setState({
                    createData:response,
                    id:response.data.data.data._id,
                })
                this.componentData(response.data.data.data._id);
            })
            .catch(error=>{
                console.log(error.response.data.message.message)
                toast.error(error.response.data.message.message)
            }) 
        }   
    }

    submitResult=()=>{
        var obj={};
        obj.result=this.state.resultName.value;
        obj.subResult=this.state.subResult;
        this.state.subResultData.map((value)=>{
            if(value.element=='DatePicker'){
                if(this.state.checkbox==true){
                    obj.nextcallDate=this.state.subResult[0].value
                }
                else{
                    obj.apptDate=this.state.subResult[0].value
                }
            }
        })
        obj.leadLogId=this.state.leadLogDataId;
        console.log(obj);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.put(process.env.REACT_APP_BACKEND_API_URL+'update/only/leadlog/'+this.state.id,obj)
        .then(response=>{
            console.log(response)
            toast.success('Leads Data updated Successfully..')
            this.props.history.push('/leadstable')
        })
        .catch(error=>{
            console.log(error)
        }) 
    }

    createNewLeadLog=()=>{
        let obj={};
        obj.company=localStorage.getItem('companyId');
        obj.userId=localStorage.getItem('userId');
        obj.leadId=this.props.match.params.id;
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'create/new/leadlog',obj)
        .then(response=>{
            console.log(response)
            toast.success('New LeadLog is created..')
            this.props.history.push('/leadstable');
        })
        .catch(error=>{
            console.log(error.response.statusText);
            toast.error(error.response.statusText)
        })
    }

    addLeadLog=()=>{
       this.createNewLeadLog()
    }

    extraFieldSelectChange=(event,index)=>{
        let array=this.state.extraField ? this.state.extraField : [];
        array[index]={label:event.text,value:event.text}
        this.setState({
            ...this.state,
            extraField:array
        })
    }

    extraFieldTextChange=(event,index)=>{
        let array=this.state.extraField ? this.state.extraField : [];
        array[index]={value:event.target.value}
        this.setState({
            ...this.state,
            extraField:array
        })
    }

    extraFieldTextAreaChange=(event,index)=>{
        let array=this.state.extraField ? this.state.extraField : [];
        array[index]={value:event.target.value}
        this.setState({
            ...this.state,
            extraField:array
        })
    }

    extraFieldCheckBoxChange=(event,index,val,idx)=>{
        let array=this.state.extraField[index] ? this.state.extraField[index] : [];
         array[idx]=event.target.checked;
         let array2=this.state.extraField;
         array2[index]=array;
         this.setState({
             ...this.state,
             extraField:array2
         })
    }

    extraFieldRadioButtonChange=(event,index,idx)=>{
        let array=[];
        array[idx]=event.target.checked;
        let Radioarray=this.state.extraField
        Radioarray[index]=array
        this.setState({
            ...this.state,
            extraField:Radioarray
        })
    }

    extraFieldNumberChange=(event,index)=>{
        let array=this.state.extraField ? this.state.extraField : [];
        array[index]={value:event.target.value}
        this.setState({
            ...this.state,
            extraField:array
        })
    }

    extraFieldDatePicker=(event,index)=>{
        //console.log(event.target.value)
        let array=this.state.extraField ? this.state.extraField : [];
        array[index]={value:event.target.value}
        this.setState({
            ...this.state,
            extraField:array
        })
    }

    subResultSelectChange=(event,index)=>{
        let selectChange=this.state.subResult ? this.state.subResult : [];
        selectChange[index]={label:event.text,value:event.text}
        this.setState({
            subResult:selectChange
        })
    }

    subResultTextChange=(event,index)=>{
        let textChange=this.state.subResult ? this.state.subResult : [];
        textChange[index]={value:event.target.value}
        this.setState({
            subResult:textChange
        })
    }

    subResultNumberChange=(event,index)=>{
        let NumberChange=this.state.subResult ? this.state.subResult : [];
        NumberChange[index]={value:event.target.value}
        this.setState({
            subResult:NumberChange
        })
    }

    subResultDatePicker=(event,index)=>{
        let datePicker=this.state.subResult ? this.state.subResult : [];
        datePicker[index]={value:event.target.value}
        this.setState({
            subResult:datePicker
        }
        ,()=>{console.log(this.state.subResult)}
        )
    }

    subResultTextAreaChange=(event,index)=>{
        let textAreaChange=this.state.subResult ? this.state.subResult : [];
        textAreaChange[index]={value:event.target.value}
        this.setState({
            subResult:textAreaChange
        })
    }

    subResultCheckboxChange=(event,value,idx)=>{
        //console.log(event,index,idx)
        let array=this.state.subResult ? this.state.subResult : [];
        if(event.target.checked==true){
            console.log(array);
            array[idx]={value:value.value,label:value.text};    
        }
        else{
            array[idx]={value:null,label:null};
        }
        this.setState({
            subResult:array
        })
    }

    subResultRadioButtonChange=(event,value,idx)=>{
        //console.log(value)
        let array=[];
        //console.log(event.target.checked);
        if(event.target.checked==true){
            array[idx]={label:value.text,value:value.value}
        }
        else{
            array[idx]={lable:null,value:null}
        }
        this.setState({
            subResult:array
        })
    }

    checkboxChange=(event)=>{
        console.log(event)
        if(event.target.checked==true){
            this.setState({
                checkbox:event.target.checked
            },()=>{console.log(this.state.checkbox)})
        }
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
                    <Card>
                        <CardHeader>
                            <h4>Create</h4>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Card>
                                       <Formik 
                                            enableReinitialize={true}
                                            initialValues={this.state}
                                            validationSchema={this.schema}
                                            onSubmit={this.onSubmit}
                                        >
                                        {({values,touched,errors,handleBlur,handleSubmit})=>(
                                            <Form onSubmit={handleSubmit}>
                                                <CardHeader>
                                                    <Row >
                                                        <Col>
                                                            <h4 style={{float:'left'}}>Lead Details</h4>
                                                            <Button style={{width: 50,height:50,float:'right'}} color='success' size="md" type="submit"> <CIcon name="cil-save" /></Button>
                                                        </Col>    
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label htmlFor='name'>FullName * :</Label>
                                                                <Input type='text' name='name'
                                                                    value={values.name}
                                                                    onBlur={handleBlur}
                                                                    onChange={this.handleChange}
                                                                    valid={!errors.name && touched.name}
                                                                    invalid={errors.name && touched.name}
                                                                />
                                                                <FormFeedback>{errors.name}</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label htmlFor='phoneNumber'>PhoneNumber *</Label>
                                                                <Input type='text' 
                                                                    name='phoneNumber'
                                                                    value={values.phoneNumber}
                                                                    onBlur={handleBlur}
                                                                    onChange={this.handleChange}
                                                                    valid={!errors.phoneNumber && touched.phoneNumber}
                                                                    invalid={errors.phoneNumber && touched.phoneNumber}
                                                                />
                                                                <FormFeedback>{errors.phoneNumber}</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label htmlFor='email'>Email Id *</Label>
                                                                <Input type='email' 
                                                                    name='email'
                                                                    value={values.email}
                                                                    onBlur={handleBlur}
                                                                    onChange={this.handleChange}
                                                                    valid={!errors.email && touched.email}
                                                                    invalid={errors.email && touched.email}
                                                                />
                                                                <FormFeedback>{errors.email}</FormFeedback>
                                                            </FormGroup>
                                                        </Col> 
                                                    </Row>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label htmlFor='address'>Address</Label>
                                                                <Input type='text' 
                                                                    name='address'
                                                                    value={values.address}
                                                                    onBlur={handleBlur}
                                                                    onChange={this.handleChange}
                                                                    valid={!errors.address && touched.address}
                                                                    invalid={errors.address && touched.address}
                                                                />
                                                                <FormFeedback>{errors.address}</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label htmlFor='assignedTo'>Assigned To</Label>
                                                                <Select name='assignedTo'
                                                                    value={values.assignedTo}
                                                                    onChange={this.userChange}
                                                                    options={this.state.options}
                                                                    invalid={!!errors.assignedTo && touched.assignedTo}
                                                                />
                                                                {touched.assignedTo ? <div style={{color:'#dc3545',fontSize:13}}>{errors.assignedTo}</div>:null}
                                                            </FormGroup>
                                                        </Col> 
                                                    </Row>
                                                </CardBody>
                                            </Form>
                                        )}
                                        </Formik>
                                        <Row style={{marginLeft:10}}>
                                            <Col md={12}>
                                                <Label> Extra Fields</Label>
                                                <Row>
                                                        {this.state.extraObject ? this.state.extraObject.map((data,index)=>{
                                                        if( data.element=='Tags'){
                                                                return(
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                                    {/* <Label> {data.label}</Label> */}
                                                                                    <Col md={8}>
                                                                                    <Select 
                                                                                        //name='extraFieldTags'
                                                                                        value={this.state.extraField[index]}
                                                                                        options={data.options}
                                                                                        onChange={(e)=>this.extraFieldSelectChange(e,index)}
                                                                                    />
                                                                                    </Col>    
                                                                                </FormGroup>
                                                                    </Col>
                                                                )
                                                        }
                                                        if(data.element=='Checkboxes'){
                                                        return(
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                        {/* <Label style={{marginLeft:-2}}> {data.label}</Label><br/> */}
                                                                        {data.options.map((val,idx)=>{
                                                                            return (
                                                                                <div>
                                                                                    <Input 
                                                                                        //name='extraFieldValue'
                                                                                        style={{marginLeft:2}} 
                                                                                        type='checkbox' 
                                                                                        value={val.value}
                                                                                        checked={this.state.extraField[index] ? this.state.extraField[index][idx] : false}
                                                                                        //value={this.state.extraField}
                                                                                        onChange={(e)=>this.extraFieldCheckBoxChange(e,index,val,idx)}
                                                                                        
                                                                                    />
                                                                                    <Label style={{marginLeft:22}}>{val.text}</Label>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                </FormGroup>
                                                            </Col>
                                                        )
                                                        }
                                                        if(data.element=='RadioButtons'){
                                                        return (
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                    {/* <Label style={{marginLeft:-2}}> {data.label}</Label><br/> */}
                                                                    {data.options.map((val,idx)=>{
                                                                        return (
                                                                            <div>
                                                                                <Input 
                                                                                    //name='extraFieldValue'
                                                                                    style={{marginLeft:2}} 
                                                                                    type='radio'
                                                                                    value={val.value} 
                                                                                    checked={this.state.extraField[index] ? this.state.extraField[index][idx] : false}
                                                                                    onChange={(e)=>this.extraFieldRadioButtonChange(e,index,idx)}
                                                                                />
                                                                                <Label style={{marginLeft:22}}>{val.text}</Label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                            </FormGroup>
                                                        </Col>
                                                        )
                                                        }
                                                        if(data.element=='TextInput'){
                                                        return(
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                    {/* <Label style={{marginLeft:13}}> {data.label}</Label><br/> */}
                                                                    <Col md={8}>
                                                                    <Input type='text'
                                                                            //name='extraFieldTextInput'
                                                                            value={this.state.extraField[index] ? this.state.extraField[index].value : null}
                                                                            onChange={(e)=>this.extraFieldTextChange(e,index)}
                                                                    />  
                                                                    </Col> 
                                                            </FormGroup>
                                                        </Col>
                                                        )
                                                        }
                                                        if(data.element=='DatePicker'){
                                                        return (
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label>{data.label}</Label><br/>
                                                                <Col md={6}>
                                                                    <Input type='date' 
                                                                    value={this.state.extraField[index] ? this.state.extraField[index].value : null}
                                                                    onChange={(e)=>this.extraFieldDatePicker(e,index)}/>
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                        )
                                                        }
                                                        if(data.element=='NumberInput'){
                                                        return (
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                    {/* <Label style={{marginLeft:13}}> {data.label}</Label><br/> */}
                                                                    <Col md={8}>
                                                                    <Input type='text'
                                                                            //name='extraFieldValue'
                                                                            value={this.state.extraField[index] ? this.state.extraField[index].value : null}
                                                                            onChange={(e)=>this.extraFieldNumberChange(e,index)}
                                                                    />  
                                                                    </Col> 
                                                            </FormGroup>
                                                        </Col>    
                                                        )
                                                        }
                                                        if(data.element=='TextArea'){
                                                        return (
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                    {/* <Label style={{marginLeft:13}}> {data.label}</Label><br/> */}
                                                                    <Col md={8}>
                                                                    <Input type='textarea'
                                                                            //name='extraFieldValue'
                                                                            value={this.state.extraField[index] ? this.state.extraField[index].value : null}
                                                                            onChange={(e)=>this.extraFieldTextAreaChange(e,index)}
                                                                    />  
                                                                    </Col> 
                                                            </FormGroup>
                                                        </Col>
                                                        )
                                                        } 
                                                        }):null} 
                                                        </Row>   
                                            </Col>
                                        </Row>     
                                    </Card>
                                </Col>
                            </Row>
                            {( this.state.createData  && this.state.updateData ) || (this.state.updateData && this.state.leadLogDataId)  ? 
                            <Card>
                                <CardHeader><h4>Result</h4></CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md={4}>
                                            <Label htmlFor='result'>Result</Label>
                                            <Select name='resultName'
                                                value={this.state.resultName}
                                                onChange={this.resultChange}
                                                options={this.state.resultOptions}/>
                                        </Col>
                                        <Col>
                                          {this.state.subResultData ? this.state.subResultData.map((val,index)=>{
                                              console.log(val,index)
                                            if(val.element=='TextInput'){   
                                                return(<FormGroup>
                                                    <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                                    <Col md={6}>
                                                    <Input type='text'
                                                        value={this.state.subResult ? this.state.subResult[index].value: null}
                                                        onChange={(e)=>this.subResultTextChange(e,index)}
                                                    />  
                                                    </Col> 
                                                    </FormGroup>)
                                            }
                                            if(val.element=='DatePicker'){
                                                return(<FormGroup>
                                                    <Label>{val.label}</Label><br/>
                                                    <Col md={6}>
                                                        <Input type='date'
                                                        value={this.state.subResult ? this.state.subResult[index].value : null}
                                                        onChange={(e)=>this.subResultDatePicker(e,index)}
                                                        />
                                                    </Col>
                                                    </FormGroup>)
                                            }
                                            if(val.element=='Checkboxes'){   
                                                return(<FormGroup>
                                                        <Label style={{marginLeft:-2}}> {val.label}</Label><br/>
                                                        {val.options.map((value,idx)=>{
                                                            return (
                                                                <div>
                                                                    <Input 
                                                                        style={{marginLeft:2}} 
                                                                        type='checkbox' 
                                                                        value={value.value}
                                                                        //checked={this.state.subResult ? this.state.subResult[index][idx] : null}
                                                                        onChange={(e)=>this.subResultCheckboxChange(e,value,idx)}
                                                                    /><Label style={{marginLeft:22}}>{value.text}</Label>
                                                                </div>
                                                            )
                                                        })}
                                                </FormGroup>)
                                            }
                                            if(val.element=='NumberInput'){
                                                return(<FormGroup>
                                                    <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                                    <Col md={6}>
                                                    <Input type='text'
                                                        value={this.state.subResult ? this.state.subResult[index].value : null}
                                                        onChange={(e)=>this.subResultNumberChange(e,index)}    
                                                    />  
                                                    </Col> 
                                                    </FormGroup>)
                                            }
                                            if(val.element=='Tags'){
                                                return(<FormGroup>
                                                        <Label> {val.label}</Label>
                                                        <Col md={6}>
                                                        <Select 
                                                            options={val.options}
                                                            value={this.state.subResult ? this.state.subResult[index] : null}
                                                            onChange={(e)=>this.subResultSelectChange(e,index)}
                                                        />
                                                        </Col>    
                                                </FormGroup>)
                                            }
                                            if(val.element=='RadioButtons'){
                                                return (<FormGroup>
                                                    <Label style={{marginLeft:-2}}> {val.label}</Label><br/>
                                                    {val.options.map((value,idx)=>{
                                                        return (
                                                            <div>
                                                                <Input 
                                                                    style={{marginLeft:2}} 
                                                                    type='radio' 
                                                                    value={value.value}
                                                                    onChange={(e)=>this.subResultRadioButtonChange(e,value,idx)}
                                                                />
                                                                <Label style={{marginLeft:22}}>{value.text}</Label>
                                                            </div>
                                                        )
                                                    })}
                                                    </FormGroup>)
                                            }
                                            if(val.element=='TextArea'){
                                                return (<FormGroup>
                                                        <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                                        <Col md={6}>
                                                        <Input type='textarea'
                                                           value={this.state.subResult ? this.state.subResult[index] : null}
                                                           onChange={(e)=>this.subResultTextAreaChange(e,index)}
                                                        />  
                                                        </Col> 
                                                </FormGroup>)
                                            }

                                          }):null}  
                                        </Col>
                                        <Col style={{marginTop:30}}>{(this.state.resultName.value == '61bc2a991c46e22db864ec80') ? <><Input type='checkbox' name='checkbox' onChange={(e)=>this.checkboxChange(e)}/><Label htmlFor='checkbox'>Do you want to create new LeadLog?</Label></>: null}</Col>
                                    </Row>
                                </CardBody>
                            </Card> :null}
                            {this.state.updateData && this.state.leadsLogData ==null ? 
                            <Card>
                               <CardHeader><h4>Result</h4></CardHeader> 
                               <CardBody>
                                   <Button color='primary' style={{color:'white'}} onClick={this.addLeadLog}>AddLeadLog</Button>
                               </CardBody>
                            </Card> : null}
                            {(this.state.createData && this.state.updateData ) || (this.state.updateData && this.state.leadLogDataId)? 
                            <Row className='text-center'>
                                <Col className='text-center'>
                                    <Button size='lg' type='reset' outline color='danger' style={{width:200}} onClick={this.reset}>Cancel</Button>
                                    <Button size='lg' type='submit' outline color='primary' style={{width:200,marginLeft:10}} onClick={this.submitResult}>Save Result</Button>
                                </Col>
                            </Row> :null}
                            <br/>
                            <Accordion>
                            <Card>
                                <CardHeader style={{padding:0}}>
                                    <Accordion.Toggle as={CardBody} eventKey="1">
                                        <Row>
                                        <Col><h5>History</h5></Col>
                                        </Row>
                                    </Accordion.Toggle>
                                </CardHeader>
                                <Accordion.Collapse eventKey="1">
                                <CardBody>
                                    {this.state.leadActivity ? this.state.leadActivity.map((element)=>
                                    (
                                        <Card>
                                            <CardBody>
                                            {element.lead_activity.startsWith('Lead') ? <h4 style={{color:'blue'}}>{element.lead_activity}</h4> : null}
                                            {element.lead_activity.startsWith('An') ? <h4 style={{color:'Red'}}>{element.lead_activity}</h4> : null}
                                            {element.lead_activity.startsWith('Result') ? <h4 style={{color:'Green'}}>{element.lead_activity}</h4> : null}
                                            Created At : {element.createdAt}<br/>
                                            Created By : {element.createdBy.fullName}
                                            </CardBody>
                                        </Card>
                                        
                                    )) : null}
                                </CardBody>
                                </Accordion.Collapse>
                            </Card>
                            </Accordion>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }
}
export default CreateLead