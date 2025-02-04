import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./component/Header";
import UserForm from "./component/UserForm";
import ViewUsers from "./component/ViewUser";
import LiveUsers from "./component/LiveUsers";

const App = () => {
  const [hasUsers, setHasUsers] = useState(false);

  const handleUserSaved = () => {
    setHasUsers(true); 
  };

  return (
    <Router>
      <Header hasUsers={hasUsers} />
      <Routes>
        <Route path="/" element={<UserForm onUserSaved={handleUserSaved} />} />
        <Route path="/viewUser" element={<ViewUsers />} />
        <Route path="/liveUsers" element={<LiveUsers />} />
      </Routes>
    </Router>
  );
};

export default App;
