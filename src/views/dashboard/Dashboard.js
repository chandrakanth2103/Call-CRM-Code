import React, { Component} from 'react'
import {Card,CardBody,CardHeader,Button ,Row,Col,FormGroup, Label,Input} from 'reactstrap'
import Select from 'react-select';
import axios from 'axios';
import {ListGroup, ListGroupItem } from 'reactstrap'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Dashboard extends Component{

    state={
      assignTo:'',
      resultOption:[],
      resultData:[],
      callLogs:[],
      total_duration:'',
      average_duration:'',
      today:true,
      yesterday:false,
      last7Days:false,
      last30Days:false, 
      startDate:'',
      lastDate:'',
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
                resultOption:optionsArray
            })
        })
        .catch(error=>{
            console.log(error)
        })

        axios.get(process.env.REACT_APP_BACKEND_API_URL+'admin/dashboard/'+companyId)
        .then(response=>{
          console.log(response)
          this.setState({
            resultData:response.data.data.result,
            callLogs:response.data.data.callLogs,
          }) 
          response.data.data.callLogs.map((value)=>{
            let totalCallMin=parseInt((value.total_duration/60));
            let totalMin=parseInt(value.total_duration % 60);
            let totalCall=totalCallMin+':'+totalMin;
            let averageCallMin=parseInt((value.average_duration/60));
            let averageMin=parseInt(value.average_duration % 60);
            let averagecall=averageCallMin+':'+averageMin;
              this.setState({total_duration:totalCall,average_duration:averagecall})
           }) 
        })
        .catch(error=>{
          console.log(error)
        })
    }

    assignChange=(event)=>{
      let payload={assignedTo:event.value};
      //console.log(event)
      let companyId=localStorage.getItem('companyId')
      axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
      axios.post(process.env.REACT_APP_BACKEND_API_URL+'admin/dashboard/filter/'+companyId,payload)
      .then(response=>{
        console.log(response)
        this.setState({
          resultData:response.data.data.result,
          callLogs:response.data.data.callLogs,
          assignTo:event
        })
        response.data.data.callLogs.map((value)=>{
          let totalCallMin=parseInt((value.total_duration/60));
          let totalMin=parseInt(value.total_duration % 60);
          let totalCall=totalCallMin+':'+totalMin;
          let averageCallMin=parseInt((value.average_duration/60));
          let averageMin=parseInt(value.average_duration % 60);
          let averagecall=averageCallMin+':'+averageMin;
          this.setState({total_duration:totalCall,average_duration:averagecall})
         }) 
      })
      .catch(error=>{
        console.log(error)
      })
    }

    filterLead=(value)=>{
      //console.log(value)
      let payload={};
      if(value=='today'){
        payload.filter='today';
        this.setState({
          today:true,
          yesterday:false,
          last7Days:false,
          last30Days:false,
        })
      }
      if(value=='yesterday'){
        payload.filter='yesterday';
        this.setState({
          today:false,
          yesterday:true,
          last7Days:false,
          last30Days:false,
        })
      }
      if(value=='last_7_days'){
        payload.filter='last_7_days';
        this.setState({
          today:false,
          yesterday:false,
          last7Days:true,
          last30Days:false,
        })
      }
      if(value=='last_30_days'){
        payload.filter='last_30_days';
        this.setState({
          today:false,
          yesterday:false,
          last7Days:false,
          last30Days:true,
        })
      }
      console.log(payload)
      let companyId=localStorage.getItem('companyId')
      axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
      axios.post(process.env.REACT_APP_BACKEND_API_URL+'admin/dashboard/filter/'+companyId,payload)
      .then(response=>{
        console.log(response)
        this.setState({
          resultData:response.data.data.result,
          callLogs:response.data.data.callLogs
        })
      })
      .catch(error=>{
        console.log(error)
      })
    }

    change=()=>{
      console.log(this.state.startDate,this.state.lastDate);
      
    }

  DateChange= async (event)=>{
   this.setState({
     [event.target.name]:event.target.value
   })
   Promise.all(this.state.startDate,this.state.lastDate)
   .then(()=>{
    let payload={from:this.state.startDate,to:this.state.lastDate,filter:'select_range'}
    if(this.state.startDate != '' && this.state.lastDate !=''){
      console.log(payload)
      let companyId=localStorage.getItem('companyId')
      axios.defaults.headers.common['Authorization']=localStorage.getItem('cktoken')
      axios.post(process.env.REACT_APP_BACKEND_API_URL+'admin/dashboard/filter/'+companyId,payload)
      .then(response=>{
        console.log(response)
        this.setState({
          resultData:response.data.data.result,
          callLogs:response.data.data.callLogs
        })
      })
      .catch(error=>{
        console.log(error)
      })
      }
   })
   .catch(()=>{
     console.log('Error')
   })
   
  }

  render(){
   return(
     <div>
       <div >
        <ToastContainer
          position="top-right"
          autoClose={2000}
          style={{ zIndex: "1999" }}
        />
        <Row>
          <Col md={5} style={{margin:'auto'}}>
            <Card>
              <CardHeader><h5>Dashboard</h5></CardHeader>
              <CardBody>
               <div>
                 {/* {this.state.startDate &&this.state.lastDate ? 'hello': null} */}
                 <Row style={{marginLeft:40}}>
                   <Col md={2}>
                      <Button 
                        onClick={()=>this.filterLead('today')} 
                        className={this.state.today ? 'active' : 'inactive'}
                        outline color='primary' style={{height:70}}><b>Today</b></Button>
                   </Col>
                   <Col md={2} style={{paddingLeft:15}}>
                      <Button 
                        onClick={()=>this.filterLead('yesterday')} 
                        outline color='primary' 
                        style={{height:70}}
                        className={this.state.yesterday ? 'active' : 'inactive'}
                      >
                        <b>Yesterday</b>
                      </Button>
                   </Col>
                   <Col md={2} style={{paddingLeft:37}}>
                      <Button 
                        onClick={()=>this.filterLead('last_7_days')}  
                        outline color='primary'
                        style={{width:100,height:70}}
                        className={this.state.last7Days ? 'active' : 'inactive'}
                      >
                        <b>Last 7 <br/>days</b>
                      </Button>
                   </Col>
                   <Col md={2} style={{paddingLeft:70}}>
                      <Button 
                        onClick={()=>this.filterLead('last_30_days')}  
                        outline color='primary' 
                        style={{width:100,height:70}}
                        className={this.state.last30Days ? 'active' : 'inactive'}
                      >
                        <b>Last 30 <br/>days</b>
                      </Button>
                   </Col>
                 </Row>
               </div>
               <br/>
               <Row>
                 <Col>
                    <Label htmlFor='startDate'><b>Start Date</b></Label><Input type='date' name='startDate' onChange={(e)=>this.DateChange(e)}/>
                 </Col>
                 <Col>
                    <Label htmlFor='lastDate'><b>Last Date</b></Label><Input type='date' name='lastDate' onChange={(e)=>this.DateChange(e)}/>
                 </Col>
               </Row><br/>
               <Row style={{marginTop:10}}>
                 <Col>
                  <FormGroup>
                    <Label htmlFor='assignTo'><b>Lead Assigned User</b></Label>
                    <Select name='assignTo'
                      value={this.state.assignTo}
                      onChange={this.assignChange}
                      placeholder='All Users'
                      options={this.state.resultOption}
                      />
                  </FormGroup>
                 </Col>
               </Row>
               <Row style={{marginTop:10}}>
                 <Col>
                 <ListGroup>
                   <ListGroupItem style={{backgroundColor:'blue',color:'white'}}><b>OUTBOUND</b></ListGroupItem>
                   <>
                      <ListGroupItem>
                        <Row>
                          <Col>Total Time </Col>
                          {this.state.callLogs.length !=0 ? 
                          <Col md={8} style={{paddingLeft:220}}><strong>{this.state.total_duration}min</strong></Col>
                          :<Col md={8} style={{paddingLeft:220}}><strong>0min</strong></Col>}
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Row>
                          <Col>Average Time</Col>
                          {this.state.callLogs.length !=0 ?
                          <Col md={8} style={{paddingLeft:250}}><strong>{this.state.average_duration}</strong></Col>
                          :<Col md={8} style={{paddingLeft:220}}><strong>0</strong></Col>}
                        </Row>
                      </ListGroupItem>
                   </>
                 </ListGroup>
                 </Col>
               </Row>
               <Row style={{marginTop:15}}>
                 <Col>
                    <ListGroup>
                      <ListGroupItem style={{backgroundColor:'blue',color:'white'}}><b>STATUS</b></ListGroupItem>
                        {this.state.resultData ? this.state.resultData.map((element)=>(element.resultName != ''? 
                          <Row>
                            <Col>
                              <ListGroupItem>
                                <Row>
                                  <Col>{element.resultName}</Col><Col md={8} style={{paddingLeft:250}}><strong>{element.count}</strong></Col>
                                </Row>
                              </ListGroupItem>
                            </Col>
                            </Row>
                        :null)) : null}
                    </ListGroup>
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
export default Dashboard
