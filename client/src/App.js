import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './LayOut/Navbar';
import Footer from './LayOut/Footer';
import Home from './pages/Home';
import Howwork from './pages/Howwork';
import ApplyJob from './pages/ApplyJob';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const Layout = () => {
    return (
      <div className='app'>
        <Navbar />
        <Outlet />
        <Footer/>
        <ChatProvider/>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/howwork' element = {<Howwork />} />
        <Route path='/register' element = {<Register />} />
        <Route path='/login' element = {<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
