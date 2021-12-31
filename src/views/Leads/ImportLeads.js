import React,{Component} from 'react'
import {Card,CardBody,CardHeader,Row,Col,Button,Input,FormGroup,Label,FormFeedback} from 'reactstrap';
import Select from 'react-select';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';
import leadFile from './leadFormat.xlsx';

class ImportLeads extends Component{
    state={
        select:[],
        options:[],
        checkbox:false,
        files:'',
        excelSheetHeaders:[
            'Lead','Email','Phone','Address'
        ],
        successData:[],
        errorData:[],
        responseError:[],
        leadError:'',
        Error:[],
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
    }

    schema=()=>{
        return(
            Yup.object().shape({
                select:Yup.object().required('select the user'),
            })
        )
    }

    handleChange=(event)=>{
        //console.log(event);
        let selectArray=[];
        event.map((val,index)=>{
        selectArray.push(val)})
        this.setState({
            select:selectArray
        }
        //,()=>{console.log(this.state.select)}
        )
    }

    dropFile=(files)=>{
        //console.log(file);
        this.setState({files:files[0]})
        //console.log(this.state.files.name)
       const readDropFile=files[0];
       const dropFileReader= new FileReader();
        dropFileReader.readAsArrayBuffer(readDropFile);
        dropFileReader.onload=(event)=>{
            const dropArrayData=event.target.result;
            const dropwb=XLSX.read(dropArrayData,{type:'buffer'});
            const dropwsname=dropwb.SheetNames[0];
            const dropws=dropwb.Sheets[dropwsname];
            const dropData=XLSX.utils.sheet_to_json(dropws,{header:1});
            let array=dropData[0];
            let errorDataValues=[];
            array.map((value,index)=>{
                if(this.state.excelSheetHeaders.includes(value)){
                }
                else{
                    errorDataValues.push(value);
                }
            })
               this.setState({
                       successData:this.state.excelSheetHeaders,
                       errorData:errorDataValues
                   })
        }
    }

    dropFileChange=(event)=>{
        console.log(event.target.files);
        this.setState({files:event.target.files[0]})
        const readDropFile=event.target.files[0];
        const dropFileReader= new FileReader();
         dropFileReader.readAsArrayBuffer(readDropFile);
         dropFileReader.onload=(event)=>{
             const dropArrayData=event.target.result;
             const dropwb=XLSX.read(dropArrayData,{type:'buffer'});
             const dropwsname=dropwb.SheetNames[0];
             const dropws=dropwb.Sheets[dropwsname];
             const dropData=XLSX.utils.sheet_to_json(dropws,{header:1});
             let array=dropData[0];
             let errorDataValues=[];
             array.map((value,index)=>{
                 if(this.state.excelSheetHeaders.includes(value)){
                 }
                 else{
                     errorDataValues.push(value);
                 }
             })
                this.setState({
                        successData:this.state.excelSheetHeaders,
                        errorData:errorDataValues
                    })
         }
    }

    checkboxChange=(event)=>{
        //console.log(event.target.checked)
        if(event.target.checked==true)
        this.setState({
            checkbox:event.target.checked
        }
        //,()=>{console.log(this.state.checkbox)}
        )
    }

    onSubmit=()=>{
        let companyId=localStorage.getItem('companyId');
        let userId=localStorage.getItem('userId');
        //console.log(companyId,userId,values);
       var formData = new FormData();
       formData.append('allowDuplicate',this.state.checkbox);
       this.state.select.map((element,index)=>{
        formData.append('users[]',element.value);
       })
       formData.append('images',this.state.files)
       console.log(formData);
        axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
        axios.post(process.env.REACT_APP_BACKEND_API_URL+'file/upload/'+companyId +'/'+ userId,formData)
        .then(response=>{
            console.log(response);
            toast.success('Leads Data is successfully uploaded..')
                this.props.history.push('/leadstable');
        })
        .catch(error=>{
            console.log(error.response)
            toast.error('Invalid Data Format..')
            let errorData=[];
            //console.log(error.response.data.data)
            if(error.response.data.data=='all the leads are already exist.'){
                errorData.push({value:error.response.data.data})
            }
            else{
            for(let i=0;i<error.response.data.data.length;i++){
                errorData.push({value:error.response.data.data[i]})
            }
        }
            console.log(errorData);
            this.setState({
                responseError:errorData,
                leadError:error.response.data.data,
                Error:error.response,
            }
            ,()=>{console.log(this.state.responseError,this.state.Error,this.state.leadError)}
            )
        })
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
                <Card>
                    <CardHeader style={{backgroundColor:'blue',color:'white'}}> 
                    <Row>
                        <Col md={6}>Import Leads </Col>
                        <Col md={6}><a href={leadFile} style={{color:'white',marginLeft:330}} download='leadFile'>Click to download the lead template</a></Col>
                    </Row>
                    </CardHeader>
                            <CardBody>
                                <Formik
                                enableReinitialize={true}
                                initialValues={this.state}
                                //validationSchema={this.schema}
                                onSubmit={this.onSubmit}
                                >
                                    {({values,errors,touched,handleSubmit,handleBlur})=>(
                                        <Form onSubmit={handleSubmit}>
                                            <Card>
                                                <CardBody>
                                            <Col md={4}>
                                                <FormGroup>
                                            <Label htmlFor='select'> Assign Leads to User</Label>
                                            <Select name='select'
                                                value={values.select}
                                                isMulti
                                                onChange={this.handleChange}
                                                onBlur={handleBlur}
                                                options={this.state.options}
                                                invalid={!!errors.select && touched.select}
                                            />
                                            {touched.select ? <div style={{color:'#dc3545',fontSize:13}}>{errors.select}</div> : null}
                                            </FormGroup>
                                            </Col>
                                            <Col style={{marginLeft:20}}>
                                            <Input type='checkbox' name='checkbox' onChange={(e)=>this.checkboxChange(e)}/><Label htmlFor='checkbox'>Allow storage of Duplicate Leads ?</Label>
                                            </Col>
                                            <Row style={{marginLeft:5}}>
                                                <Col>
                                                    <Label htmlFor='img'></Label>
                                                    <Input type='file' id='img' accept=".xlsx,.xls" onChange={this.dropFileChange}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col >
                                                    <div style={{width:500,border: '3px dashed black',backgroundColor:'white',margin:20,height:85}}>
                                                        <Dropzone onDrop={this.dropFile} accept={['.xlsx','.xls']}>
                                                            {({getRootProps,getInputProps})=>(
                                                                <section className='container'>
                                                                    <div {...getRootProps ({className:'dropzone'})}>
                                                                    <h5 style={{paddingLeft:100}}> Drag and drop your files here</h5>
                                                                    <p>{this.state.files.name}</p>
                                                                    </div>
                                                                </section>
                                                            )}
                                                        </Dropzone>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                   {this.state.errorData !='' ? <p style={{color:'red'}}>The Obtained Format for <b>{this.state.errorData.join(',')}</b> is Invalid .The Required Format is <b>{this.state.successData.join(',')}</b></p>: null }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                {this.state.Error != '' ? <div><p style={{color:'red'}}><b> Error :</b><br/>{this.state.responseError.map((values)=><div>{values.value}</div>)}</p></div>:<div>{this.state.leadError}</div>}
                                                </Col>
                                            </Row>
                                            </CardBody>
                                            </Card>
                                            <CardBody>
                                             <Row className='text-center'>
                                                <Col className='text-center'>
                                                <Button size='lg' type='reset' outline color='danger' style={{width:200}}>Cancel</Button>
                                                <Button size='lg' type='submit' outline color='primary' style={{width:200,marginLeft:30}} >Submit</Button>
                                                </Col>
                                            </Row>
                                           </CardBody>
                                        </Form>
                                    )}

                                </Formik>
                       
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default ImportLeads