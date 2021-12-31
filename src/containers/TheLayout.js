import React,{Component} from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

class TheLayout extends Component{

  
  render(){
  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        {/* <TheFooter/> */}
      </div>
    </div>
  )
  }
}

export default TheLayout
