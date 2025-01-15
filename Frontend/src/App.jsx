import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import UserForm from "./component/UserForm";
import ViewUsers from "./component/ViewUser";
import LiveUsers from "./component/LiveUsers";

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/viewUser" element={<ViewUsers />} />
      <Route path="/liveUsers" element={<LiveUsers />} />
    </Routes>
  </Router>
);

export default App;
