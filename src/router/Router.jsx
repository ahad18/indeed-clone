import React from 'react'

import { createBrowserRouter, } from "react-router-dom";
import App from '../App';
import Home from '../pages/Home';
import MyJobs from '../pages/MyJobs';
import SalaryPage from '../pages/SalaryPage';
import CreateJob from '../pages/CreateJob';
import UpdateJob from '../pages/UpdateJob';
import JobDetails from '../pages/JobDetails';
import Login from '../pages/Login';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import AppliedCandidates from '../pages/AppliedCandidates';


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>,
//     children: [
//       {
//           path: "/",
//           element: <Home/>
//       },
//       {
//           path: "/my-job",
//           element: <PrivateRoute><MyJobs/></PrivateRoute>
//       },
//       {
//           path: "/salary",
//           element: <SalaryPage/>
//       },
//       {
//         path: "/post-job",
//         element: <CreateJob/>
//       },
//       {
//         path: "edit-job/:id",
//         element: <UpdateJob/>,
//         loader: ({params}) => fetch(`http://localhost:5000/all-jobs/${params.id}`)
//       },
//       {
//         path:"/jobs/:id",
//         element: <JobDetails/>,
//       }
//     ]
//   },
//   {
//     path: "/login",
//     element: <Login/>
//   }
// ]);

function RouterApp() {

  let token = localStorage.getItem("token");

  console.log(token);

return (
  <Router>
    <Routes>
      <Route path="/" element={token !== null ? <App /> : <Navigate to="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/my-job" element={<MyJobs />} />
        <Route path="/applied-candidates" element={<AppliedCandidates />} />
        <Route path="/salary" element={<SalaryPage />} />
        <Route path="/post-job" element={<CreateJob />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="edit-job/:id" element={<UpdateJob />} loader={({ params }) => fetch(`http://localhost:5000/all-jobs/${params.id}`)} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>
      <Route path="/login" element={token === null ? <Login /> : <Navigate to="/" />} />
      <Route path="/sign-up" element={token === null ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  </Router>
)
}

export default RouterApp;