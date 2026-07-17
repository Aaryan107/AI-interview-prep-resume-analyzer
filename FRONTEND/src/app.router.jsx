import {createBrowserRouter, Link} from 'react-router'

import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Protected from './features/auth/components/Protected'
import { Home } from './features/interview/pages/Home.jsx'
import { Interview as InterviewReport } from './features/interview/pages/Interview'


export const router=createBrowserRouter([
    {
        path: '/',
        element: <Protected><Home/></Protected>,
        errorElement: <div><h1>404 Not Found</h1><Link to="/">Go Home</Link></div>
    },
    {
        path:'/interview/:interviewId',
        element: <Protected><InterviewReport/></Protected>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    }
])
