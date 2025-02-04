import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserActionsButtons from './component/UserActionsButtons';
import UserForm from './component/UserForm';
import ViewUser from './component/ViewUser';
import LiveUser from './component/LiveUsers';
import Login from './component/Login';
import Header from './component/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<UserActionsButtons />} />
        <Route path="/Userform" element={<UserForm />} />
        <Route path="/viewUser" element={<ViewUser />} />
        <Route path="/liveUsers" element={<LiveUser />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
