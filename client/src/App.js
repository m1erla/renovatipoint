import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './LayOut/Navbar';
import Footer from './LayOut/Footer';
import Home from './pages/Home';
import Howwork from './pages/Howwork';
import ApplyJob from './pages/ApplyJob';
import Register from './pages/Register';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import PrivacyPolicy from './components/PrivacyPolicy';
import Cookies from './components/Cookies';
import TermsAndConditions from './components/TermsAndConditions';

function App() {
  const Layout = () => {
    return (
      <div className='app'>
        <Navbar />
        <Outlet />
        <Footer/>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/apply-for-a-job' element = {<ApplyJob />} />
        <Route path='/howwork' element = {<Howwork />} />
        <Route path='/register' element = {<Register />} />
        <Route path='privacy' element = { <Privacy />}>
          <Route path='privacy-policy' element ={<PrivacyPolicy />} />
          <Route path='cookies' element = {<Cookies/>} />
          <Route path='terms-conditions' element = {<TermsAndConditions/>} />
        </Route>
        <Route path='/login' element = {<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
