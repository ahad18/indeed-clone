import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import router from './router/Router.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import RouterApp from './router/Router.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterApp />
  {/* <RouterProvider router={router} /> */}
</AuthProvider>
)
