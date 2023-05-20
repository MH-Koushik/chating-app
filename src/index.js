import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import firebaseConfig from './firebaseConfig';
import { createBrowserRouter, RouterProvider, Route, } from "react-router-dom";
import Registration from './pages/registration';
import Login from './pages/login';
import Home from './pages/home';
import ForgotPassword from './pages/forgotpassword';
import store from './store'
import { Provider } from 'react-redux'
import ChatPage from './pages/chatPage';

  const router = createBrowserRouter([
    {
      path: "/" ,
      element: <Home/>,
    },
    {
      path: "/login" ,
      element: <Login/>,
    },
    {
      path: "/registration" ,
      element: <Registration/>,
    },
    {
      path: "/forgotpassword" ,
      element: <ForgotPassword/>,
    },
    {
      path: "/chatPage" ,
      element: <ChatPage/>,
    },
  ]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
