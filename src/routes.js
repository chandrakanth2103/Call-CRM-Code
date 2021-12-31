import React from 'react';


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Main=React.lazy(()=>import ('./views/main/Main'));
const Component1=React.lazy(()=>import('./views/components/Component1'));
const Component2=React.lazy(()=>import('./views/components/Component2'));
const Login= React.lazy(()=>import('./views/pages/login/Login'));
const Register=React.lazy(()=>import('./views/pages/register/Register'));
const Users=React.lazy(()=>import('./views/users/Users'));
const UserForm=React.lazy(()=>import('./views/users/CreateUserForm'));
const Roles=React.lazy(()=>import('./views/permissions/Roles'));
const CreateRole=React.lazy(()=>import('./views/permissions/CreateRoleForm'));
const FormBuilder=React.lazy(()=>import('./views/FormBuilder/FormBuilder'));
const CustomFields=React.lazy(()=>import('./views/CustomFields/CustomFields'));
const LeadsTable=React.lazy(()=>import('./views/Leads/LeadsTable'));
const CreateLead=React.lazy(()=>import('./views/Leads/CreateLead'));
const ImportLead=React.lazy(()=>import('./views/Leads/ImportLeads'));
const assignTo=React.lazy(()=>import('./views/AssignTo/AssignTo'));
const callsMade=React.lazy(()=>import('./views/CallsMade/CallsMade'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {path:'/main', name:'Main', component:Main},
  {path:'/components', name:'Components', component:Component1,exact:true},
  {path:'/component1', name:'Component1', component:Component1},
  {path:'/component2', name:'Component2', component:Component2}, 
  {path:'/login', name:'Login', component:Login},
  {path:'/register',name:'Register', component:Register},
  {path:'/users', name:'Users', component:Users},
  {path:'/createuserform/:id', name:'UserForm', component:UserForm},
  {path:'/roles',name:'Roles',component:Roles},
  {path:'/createroleform/:roleName', name:'CreateRole', component:CreateRole},
  {path:'/formbuilder', name:'FormBuilder', component:FormBuilder},
  {path:'/customfields', name:'CustomFields', component:CustomFields},
  {path:'/leadstable', name:'LeadsTable', component:LeadsTable},
  {path:'/createleads/:id', name:'CreateLead', component:CreateLead},
  {path:'/importleads', name:'ImportLead' , component:ImportLead},
  {path:'/assignto' , name:'assignTo' , component:assignTo},
  {path:'/callsmade' , name:'callsMade', component:callsMade},
];

export default routes;
