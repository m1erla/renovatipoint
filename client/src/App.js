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
import About from './pages/About';
import Affiliate from './components/Affiliate';
import Partner from './components/Partner';
import QualityReq from './components/QualityReq';
import ErorrPage from './components/ErorrPage';
import Propsals from './pages/Propsals';
import Contacts from './components/Contacts';
import Interest from './components/Interest';
import PropsalstoInfrom from './components/PropsalstoInfrom';
import PropsalsArchive from './components/PropsalsArchive';
import ContactsArchive from './components/ContactsArchive';
import ContactsInterest from './components/ContactsInterest';
import ForgotPassword from './components/ForgotPassword';
import MyProfile from './components/MyProfile';

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
        <Route path='propsals' element = {<Propsals />}>
          <Route path='interest' element= {<Interest/>}>
          <Route path='to-inform' element = {<PropsalstoInfrom />}/>
          <Route path='archive' element = {<PropsalsArchive />} />
          </Route>
          <Route path='contacts' element= {<Contacts/>}>
          <Route path='to-inform' element = {<ContactsInterest />}/>
          <Route path='archive' element = {<ContactsArchive />} />
          </Route>
        </Route>
        <Route path='privacy' element = { <Privacy />}>
          <Route path='privacy-policy' element ={<PrivacyPolicy />} />
          <Route path='cookies' element = {<Cookies/>} />
          <Route path='terms-conditions' element = {<TermsAndConditions/>} />
        </Route>
        <Route path='about' element={<About/>}/>
        <Route path='become-an-affiliate' element={<Affiliate/>}/>
        <Route path='partner' element={<Partner/>}/>
        <Route path='quality-requirements' element={<QualityReq/>}/>
        <Route path='my-profile' element={<MyProfile/>}/>
        <Route path='/login' element = {<Login />} />
        <Route path='login/forgot-password' element = {<ForgotPassword />} />
        <Route path='*' element = {<ErorrPage />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
