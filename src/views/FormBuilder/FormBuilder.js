import React,{Component} from 'react';
import {Card,CardBody,CardHeader,Button ,Row,Col,FormGroup,Label,Input,FormFeedback} from 'reactstrap'
import { Accordion } from 'react-bootstrap';
import {ReactFormBuilder} from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import Select from 'react-select';
import { Formik,Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert2';
import {Popover,PopoverHeader,PopoverBody,ListGroup, ListGroupItem } from 'reactstrap'
import './formbuilder.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class FormBuilder extends Component{
    state={
        formBuilder:<ReactFormBuilder/>,
        formBuilder:false,
        resultFormBuilder:[false],
        extrafieldObject:[],
        formObject:[],
        getResult:[],
        resultName:'',
        popoverFormOpen:false,
        popOverFieldId:'',
        popOver:true, 
        formId:'',
        getResultId:'',
        resultFormObject:[], 
    }

    componentDidMount(){
        let companyId=localStorage.getItem('companyId')
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/result/'+companyId)
        .then(response=>{
            console.log(response.data.data.data)
            let resultArray=[];
            let resultFalse=[];
            response.data.data.data.map((resultDisplayingData)=>{
                resultArray.push(resultDisplayingData)
                resultFalse.push(false)
            })
            this.setState({
                getResult:resultArray,
                resultFormBuilder:resultFalse   
            }
            ,()=>{console.log(this.state.getResult)}
            )
        })
        .catch(error=>{
            console.log(error)
        })
        
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/custom/forms')
        .then(response=>{
            console.log(response)
            let resultFieldsArray=[];
            response.data.data.data[0].formObject.map((val)=>{
                resultFieldsArray.push(val.taskData)
            })
            if(response.data.data.data != ''){
            this.setState({
                formObject:response.data.data.data[0].formObject,
                resultFormObject:resultFieldsArray,
                extrafieldObject:response.data.data.data[0].extrafieldObject,
                formId:response.data.data.data[0]._id,
            }
            ,()=>{console.log(this.state.extrafieldObject,this.state.formObject)}
            )
        }
        })
        .catch(error=>{
            //console.log(error)
        })
    
    }

   myFunction=(event)=>{
       this.setState({
        extrafieldObject:event.task_data
       }
       //,()=>{console.log(this.state.extrafieldObject)}
       )
    }

    resultFun=(resultFields,index,resultId)=>{
       console.log(resultFields);
       let resultObj={};
       resultObj.resultId=resultId;
       resultObj.taskData=resultFields.task_data;
       let array=this.state.formObject;
       let resultDisplayArray=this.state.resultFormObject;
       resultDisplayArray[index]=resultFields.task_data;
       array[index]=resultObj;
       this.setState({
           formObject:array,
           resultFormObject:resultDisplayArray,
       }
       //,()=>{console.log(this.state.formObject)}
       )
       //console.log(array);   
    }

    onSubmit=(values)=>{
       //console.log(values)
       let userId=localStorage.getItem('userId');
       let companyId=localStorage.getItem('companyId');
       //console.log(userId,companyId);
       let obj={};
       obj.name=values.resultName;
       axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
       if(this.state.popOverFieldId != ''){
           //console.log(values)
            axios.put(process.env.REACT_APP_BACKEND_API_URL+'update/result/'+this.state.popOverFieldId,obj)
            .then(response=>{
                //console.log(response.data.data.data)
                toast.success('Your data is updated successfully..');
                let array=[];
                response.data.data.data.map((val)=>{
                    array.push(val)
                })
                this.setState({
                    getResult:array,
                    popoverFormOpen:false,
                    popOverFieldId:'',
                    resultName:''
                }
                //,()=>{console.log(this.state.getResult)}
                )
            })
            .catch(error=>{
                console.log(error)
                toast.error(error)
            })
        }
        else{
            //console.log(values)
            axios.post(process.env.REACT_APP_BACKEND_API_URL+'create/new/result/'+companyId+'/'+userId,obj)
            .then(response=>{
                //console.log(response)
                toast.success('Your data is saved..');
                let newData=[];
                response.data.data.data.map((value)=>{
                    newData.push(value)
                })
                this.setState({
                    getResult:newData,
                    popoverFormOpen:false,
                })
            })
            .catch(error=>{
                console.log(error)
                toast.error(error)
            })
        }
    }

    popup=(e)=>{
      // console.log(e)
       this.setState({
        popoverFormOpen:true,
        })
       if(e._id){
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/result/'+e._id)
        .then(response=>{
            //console.log(response)
            this.setState({
                resultName:response.data.data.data.name,
                popOverFieldId:response.data.data.data._id
            })
        })
        .catch(error=>{
            console.log(error)
        })
       }
    }

    reactForm=(event,index)=>{
        //console.log(event);
        //console.log(this.state.resultFormBuilder);
        var data=[...this.state.resultFormBuilder];
        var dataValue=data[index];
        data[index]= ! dataValue;
        this.setState({
            resultFormBuilder:data
        }
        //,()=>{console.log(this.state.resultFormBuilder)}
        )   
    }

    submitForm=()=>{
        var extraFieldObj={};
        extraFieldObj.extraObject=this.state.extrafieldObject;
        var formResultObj={};
        formResultObj.resultObject=this.state.formObject;
        var formName='FormBilder'
        var obj={};
        obj.formName=formName;
        obj.extrafieldObject=extraFieldObj.extraObject;
        obj.formObject=formResultObj.resultObject;
        console.log(obj);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        if(this.state.formId != ''){
            // console.log(this.state.formId)
            // console.log('update');
            axios.put(process.env.REACT_APP_BACKEND_API_URL+'update/custom/form/'+this.state.formId,obj)
            .then(response=>{
                console.log(response)
                this.state.formObject.push(response.data.data.data[0].formObject)
            })
            .catch(error=>{
                //console.log(error)
            })
            console.log(this.state.formObject);
        }
        else{
            // console.log(this.state.formId);
            // console.log('create');
            axios.post(process.env.REACT_APP_BACKEND_API_URL+'create/new/custom/form',obj)
            .then(response=>{
                console.log(response)
            this.setState({
                getResultId:response.data.data._id,
                formObject:response.data.data.formObject,
            })
            })
            .catch(error=>{
                //console.log(error)
            })
            //console.log(this.state.formObject);
        }
    }
   
    render(){
       var items=[
                    {
                        key: 'Tags',
                        name: 'Tags',
                        label: 'Placeholder Label',
                        options: [],    
                    },
                    {
                        key: 'Checkboxes',
                        name: 'Checkboxes',
                        label: 'Placeholder Label',
                        options: [],
                    },
                    {
                        key:'RadioButtons',
                        name:'Multiple Choice',
                        label:'Placeholder Label',
                        options:[],
                    },
                    {
                        key: 'TextInput',
                        name: 'Text Input',
                        label: 'Placeholder Label',
                    },
                    {
                        key:'NumberInput',
                        name:'Number Input',
                        label:'Placeholder Label',
                        options:[],   
                    },
                    {
                        key:'TextArea',
                        name:'Multi-line Input',
                        label:'Placeholder Label',
                        options:[],    
                    },
                    {
                        key:'DatePicker',
                        name:'Date',
                        label: 'Placeholder Label',
                        dateFormat: 'MM/dd/yyyy',
                        timeFormat: 'hh:mm aa',
                    }
                ]
        return(
            <div>
            <div style={{marginLeft:200}}> 
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    style={{ zIndex: "1999" }}
                />
            <Row style={{marginLeft:100}}>
                <Col md={7}>
                <Card>
                    <CardHeader><h5 style={{padding:15}}>Create</h5></CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Accordion>
                                        <Card style={{margin:5}} >
                                            <CardHeader >
                                            <Accordion.Toggle  as={CardBody} eventKey="1">
                                                <h5>Result *</h5>
                                            </Accordion.Toggle>
                                            </CardHeader>
                                        <Accordion.Collapse eventKey="1">
                                            <CardBody>
                                            <ListGroup>
                                                <ListGroupItem id='Popup' onClick={this.popup} style={{backgroundColor:'blue',color:'white'}}>Add New Result </ListGroupItem>
                                                <Popover  placement='right' isOpen={this.state.popoverFormOpen} target='Popup'>
                                                    <PopoverHeader >
                                                        <h5>Result</h5>
                                                    </PopoverHeader>
                                                    <PopoverBody >
                                                    <Formik
                                                            enableReinitialize={true}
                                                            initialValues={this.state}
                                                            validationSchema={Yup.object().shape({
                                                                resultName:Yup.string().required('ResultName is required'),
                                                            })}
                                                            onSubmit={this.onSubmit}
                                                    >                                                         
                                                        {({values,errors,touched,handleSubmit,handleBlur,handleChange})=>(
                                                        <Form onSubmit={handleSubmit}>
                                                            <Row md={8}>
                                                                <Col>
                                                                    <FormGroup>
                                                                            <Label htmlFor='resultName'>Result Name *</Label>
                                                                            <Input type='text' name='resultName'
                                                                            value={values.resultName}
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            valid={!errors.resultName && touched.resultName}
                                                                            invalid={errors.resultName && touched.resultName}
                                                                            />
                                                                            <FormFeedback>{errors.resultName}</FormFeedback>
                                                                    </FormGroup> 
                                                                </Col>
                                                            </Row>
                                                            <Row className='Text-center'>
                                                                <Col className='Text-center'>
                                                                    <Button  size='md' type='submit' outline color='success' style={{width:70,marginLeft:30}}>Submit</Button>
                                                                    <Button size='md' type='reset' outline color='primary' style={{width:70,marginLeft:10}} onClick={()=>{this.setState({popoverFormOpen:false})}}>Cancel</Button>
                                                                </Col>
                                                            </Row>
                                                        </Form>                    
                                                        )}                        
                                                    </Formik>
                                                    </PopoverBody>
                                                </Popover>
                                                    {this.state.getResult ? this.state.getResult.map((val,index)=>(val.name != '' ?
                                                        <ListGroupItem id='Popup' className='list'>
                                                            <Row>
                                                                <Col><p onClick={()=>this.popup(val)}>{val.name}</p></Col>
                                                                <Col><button onClick={()=>this.reactForm(val,index)} style={{backgroundColor:'blue',color:'white',marginLeft:150}}> {this.state.resultFormBuilder[index] ? 'X' : '+'} </button></Col>
                                                            </Row>
                                                            <Popover  placement='right' target='Popup' isOpen={this.state.resultFormBuilder[index]}>
                                                                <PopoverBody>
                                                                    {this.state.resultFormBuilder[index] ? 
                                                                        <div><ReactFormBuilder data={this.state.resultFormObject[index]} toolbarItems={items} onPost={(e)=>this.resultFun(e,index,val._id)}/>
                                                                        </div>: null
                                                                    }
                                                                </PopoverBody>
                                                            </Popover>
                                                        </ListGroupItem>:null)) : null}
                                            </ListGroup>
                                            </CardBody>
                                        </Accordion.Collapse>    
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Accordion >  
                                    <Card style={{margin:5}}>
                                        <CardHeader>
                                        <Accordion.Toggle as={CardBody} eventKey="1">
                                        <h5> Extra Fields</h5>
                                        </Accordion.Toggle>
                                        </CardHeader>
                                        <Accordion.Collapse eventKey="1">
                                        <CardBody>
                                            {this.state.extrafieldObject ? this.state.extrafieldObject.map((data)=>{
                                                if (data.element=='Tags'){
                                                    return (<FormGroup>
                                                                <Label> {data.label}</Label>
                                                                <Col md={8}>
                                                                <Select 
                                                                    options={data.options}
                                                                />
                                                                </Col>    
                                                        </FormGroup>)
                                                }        
                                                if(data.element=='Checkboxes'){
                                                    return(<FormGroup>
                                                            <Label style={{marginLeft:-2}}> {data.label}</Label><br/>
                                                                {data.options.map((val)=>{
                                                                    return (
                                                                        <div>
                                                                    <Input style={{marginLeft:2}} type='checkbox' value={val.value}/><Label style={{marginLeft:22}}>{val.text}</Label>
                                                                    </div>
                                                                    )
                                                                })}
                                                            </FormGroup>)
                                                }
                                                if(data.element=='DatePicker'){
                                                    return (<FormGroup>
                                                        <Label>{data.label}</Label><br/>
                                                        <Col md={4}>
                                                            <Input type='date' />
                                                        </Col>
                                                    </FormGroup>)
                                                }
                                                if(data.element=='RadioButtons'){
                                                    return(<FormGroup>
                                                            <Label name='label'style={{marginLeft:-2}}> {data.label}</Label><br/>
                                                                {data.options.map((val)=>{
                                                                        return (
                                                                            <div>
                                                                        <Input style={{marginLeft:2}} type='radio' value={val.value}/><Label style={{marginLeft:22}}>{val.text}</Label>
                                                                        </div>
                                                                        )
                                                                })}
                                                            </FormGroup>)
                                                }
                                                if(data.element=='TextInput'){
                                                   return (<FormGroup>
                                                                <Label style={{marginLeft:13}}> {data.label}</Label><br/>
                                                                <Col md={8}>
                                                                <Input type='text'/>  
                                                                </Col> 
                                                            </FormGroup>)
                                                }
                                                if(data.element=="NumberInput"){
                                                    return(<FormGroup>
                                                            <Label style={{marginLeft:13}}> {data.label}</Label><br/>
                                                            <Col md={8}>
                                                            <Input type='text'/>  
                                                            </Col> 
                                                            </FormGroup>)
                                                }
                                                if(data.element=='TextArea'){
                                                    return(<FormGroup>
                                                            <Label style={{marginLeft:13}}> {data.value}</Label><br/>
                                                            <Col md={8}>
                                                            <Input type='textarea'/>  
                                                            </Col> 
                                                            </FormGroup>)
                                                }
                                            }) :null} 
                                        </CardBody>
                                        </Accordion.Collapse>
                                        <Accordion.Collapse eventKey="1">
                                        <CardBody>
                                            <Button type='submit' color='primary' onClick={()=>this.setState({formBuilder:true})} id='Popup2' style={{float:'right'}}>Add</Button><br/>                         
                                            {this.state.formBuilder ? <Popover placement='right' isOpen={this.state.popOver} target='Popup2'><PopoverBody><ReactFormBuilder data={this.state.extrafieldObject} onPost={(e)=>this.myFunction(e)} toolbarItems={items}/><Button type='reset' color='primary' onClick={()=>this.setState({formBuilder:false})}>Hide</Button></PopoverBody></Popover>:null}<br/>
                                        </CardBody>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>
                        <Row className='text-center'>
                            <Col className='text-center'>
                                <Button type='submit' size='lg' outline color='success' style={{width:150}} onClick={this.submitForm}>Submit</Button>
                                <Button type='reset' size='lg' outline color='danger' style={{width:150,marginLeft:10}}>Cancel</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                </Col>
            </Row>
                
            </div>
            </div>    
        )
    }
}
export default FormBuilder
