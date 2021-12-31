import React,{Component} from 'react';
import {Form,Input,Col,Row,Label, FormGroup,Card,CardBody,CardHeader} from 'reactstrap';
import Select from 'react-select';
import axios from 'axios';
import { data } from 'jquery';

class CustomFields extends Component{
    state={
        result:'',
        resultFields:[],
        options:[],
        extraobjectvalue:[],
        // TextInput:'',
        // NumberInput:'',
        // TextArea:'',
        // MultipleChoice:'',
        // Checkboxes:'',
        // select:{},
        subResultData:[],
        resultFormData:[],
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/custom/forms')
        .then(response=>{
            let data='';
            console.log(response)
            response.data.data.data.map((result)=>{
                data=result;
            })

            data.extrafieldObject.map((value)=>{
                this.state.extraobjectvalue.push(value)
            })
            this.setState({
                extraobjectvalue:data.extrafieldObject,
            }
            ,()=>{console.log(this.state.options,this.state.resultFields)}
            )

            this.setState({
                resultFormData:data.formObject,
            }
            //,()=>{console.log(this.state.resultFormData)}
            )
        })
        .catch(error=>{
            console.log(error)
        })

        let companyId=localStorage.getItem('companyId');
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.get(process.env.REACT_APP_BACKEND_API_URL+'get/company/result/'+companyId)
        .then(response=>{
            console.log(response)
            let resultNames=[];
            response.data.data.data.map((val)=>{
                console.log(val)
                resultNames.push({label:val.name,value:val._id})
            })
            this.setState({
                options:resultNames,
            }
            //,()=>{console.log(this.state.resultOptions)}
            )
        })
        .catch(error=>{
            console.log(error)
        })
    }

    resultChange=(e)=>{
        this.state.resultFormData.map((data)=>{if(data.resultId==e.value){
             this.setState({
                 subResultData:data.taskData,
                 resultName:e
             }
             ,()=>{console.log(this.state.subResultData)}
             )
         }});
         //console.log(resultValue);
      }

    selectChange=(event)=>{
        console.log(event)
        this.setState({
           select: {label:event.text,value:event.text}
        }
        //,()=>{console.log(this.state.select)}
        )
    }

    render(){
        return(
            <div>
                <Row>
                    <Col md={4}>
                        <Label htmlFor='result'>Result </Label>
                        <Select name='result'
                        value={this.state.result}
                        options={this.state.options}
                        onChange={this.resultChange}
                        />
                    </Col>
                    <Col>
                        {this.state.subResultData ? this.state.subResultData.map((val)=>{
                        if(val.element=='TextInput'){   
                            return(<FormGroup>
                                <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                <Col md={4}>
                                <Input type='text'/>  
                                </Col> 
                                </FormGroup>)
                        }                        
                        if(val.element=='Checkboxes'){   
                            return(<FormGroup>
                                    <Label style={{marginLeft:-2}}> {val.label}</Label><br/>
                                    {val.options.map((value)=>{
                                        return (
                                            <div>
                                                <Input style={{marginLeft:2}} type='checkbox' value={value.value}/><Label style={{marginLeft:22}}>{value.text}</Label>
                                            </div>
                                        )
                                    })}
                            </FormGroup>)
                        }                   
                        if(val.element=='NumberInput'){
                            return(<FormGroup>
                                <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                <Col md={6}>
                                <Input type='text'/>  
                                </Col> 
                                </FormGroup>)
                        }                    
                        if(val.element=='Tags'){
                            return(<FormGroup>
                                    <Label> {val.label}</Label>
                                    <Col md={8}>
                                    <Select 
                                        options={val.options}
                                    />
                                    </Col>    
                            </FormGroup>)
                        }                    
                        if(val.element=='RadioButtons'){
                            return (<FormGroup>
                                <Label style={{marginLeft:-2}}> {val.label}</Label><br/>
                                {val.options.map((value)=>{
                                    return (
                                        <div>
                                            <Input style={{marginLeft:2}} type='radio' value={value.value}/><Label style={{marginLeft:22}}>{value.text}</Label>
                                        </div>
                                    )
                                })}
                                </FormGroup>)
                        }                    
                        if(val.element=='TextArea'){
                            return (<FormGroup>
                                    <Label style={{marginLeft:13}}> {val.label}</Label><br/>
                                    <Col md={8}>
                                    <Input type='textarea'/>  
                                    </Col> 
                            </FormGroup>)
                        }

                      }):null}
                    </Col>                    
                </Row><br/>
                 <Row>
                    <Col md={12}>
                    <Label> Extra Fields</Label>
                        <Card>
                            <CardBody>
                                
                            {this.state.extraobjectvalue ? this.state.extraobjectvalue.map((data)=>{
                               if( data.element=='Tags'){
                                    return(<FormGroup>
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
                            if(data.element=='RadioButtons'){
                            return (<FormGroup>
                                    <Label style={{marginLeft:-2}}> {data.label}</Label><br/>
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
                            return(<FormGroup>
                                    <Label style={{marginLeft:13}}> {data.label}</Label><br/>
                                    <Col md={8}>
                                    <Input type='text'/>  
                                    </Col> 
                                    </FormGroup>)
                            }
                            if(data.element=='NumberInput'){
                            return (<FormGroup>
                                    <Label style={{marginLeft:13}}> {data.label}</Label><br/>
                                    <Col md={8}>
                                    <Input type='text'/>  
                                    </Col> 
                                    </FormGroup>)
                            }
                            if(data.element=='TextArea'){
                            return (<FormGroup>
                                    <Label style={{marginLeft:13}}> {data.label}</Label><br/>
                                    <Col md={8}>
                                    <Input type='textarea'/>  
                                    </Col> 
                                    </FormGroup>)
                            } 
                            }):null}
                            
                            </CardBody>
                        </Card>
                    </Col>
                </Row>     
            </div>
        )
    }
}
export default CustomFields