import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag:'CSidebarNavItem',
    name:'Leads',
    to:'/leadstable',
    icon: 'cil-drop',
  },
  {
    _tag:'CSidebarNavItem',
    name:'AssignTo',
    to:'/assignto',
    icon: 'cil-star',
  },
  {
    _tag:'CSidebarNavItem',
    name:'CallsMade',
    to:'/callsmade',
    icon:'cil-puzzle',
  },
  {
    _tag:'CSidebarNavItem',
    name:'Users',
    to:'/users',
    icon: 'cil-pencil',
  },
  // {
  //   _tag:'CSidebarNavItem',
  //   name:'CustomFields',
  //   to:'/customfields',
  //   icon: 'cil-puzzle',
  // },
  // {
  //   _tag:'CSidebarNavDropdown',
  //   name:'Components',
  //   route:'/components',
  //   icon: 'cil-star',
  //   _children:[
  //     {
  //       _tag:'CSidebarNavItem',
  //       name:'Component1',
  //       to:'/component1',
        
  //     },
  //     {
  //       _tag:'CSidebarNavItem',
  //       name:'Component2',
  //       to:'/component2',
  //     },
  //   ]
  // },
  // {
  //   _tag:'CSidebarNavDropdown',
  //   name:'Page',
  //   route:'/page',
  //   icon: 'cil-chart-pie',
  //   _children:[
  //     {
  //       _tag:'CSidebarNavItem',
  //       name:'Login',
  //       to:'/login'
  //     },
  //     {
  //       _tag:'CSidebarNavItem',
  //       name:'Register',
  //       to:'/register'
  //     }
  //   ]
  // },
  {
    _tag:'CSidebarNavItem',
    name:'FormBuilder',
    to:'/formbuilder',
    icon: 'cil-cursor',
  },
  
]

export default _nav
