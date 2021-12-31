import React, { Component, Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

import routes from '../routes'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class TheContent extends Component {
  render(){
  return (
    <main className="c-main">
      <CContainer fluid>
        
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  component={props => (
                   
                      <route.component {...props} />
                   
                  )} />
                  
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        
      </CContainer>
    </main>
  )
          }
}

export default (TheContent)
