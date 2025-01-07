import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './component/UserForm';
import ViewUsers from './component/ViewUser';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/viewUser" element={<ViewUsers />} />
    </Routes>
  </Router>
);

export default App;
