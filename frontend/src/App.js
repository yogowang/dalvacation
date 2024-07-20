import './App.css';
import Login from './pages/authentication/login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/authentication/signup/Signup';
import LoginSecondFactor from './pages/authentication/login/LoginSecondFactor';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import LoginThirdFactor from './pages/authentication/login/LoginThirdFactor';
import SignupConfirmation from './pages/authentication/signup/SignupConfirmation';
import { RoomDetailsIndex, RoomList } from './pages/room-details/RoomList';
import { AddRoomDetails } from './pages/room-details/AddRoomDetails/AddRoomDetails';
import { UpdateRoomDetails } from './pages/room-details/UpdateRoomDetails/UpdateRoomDetails';
import Home from './pages/home/Home';
import ChatBot from './components/chatbot/ChatBot';
import RoomDetailsPage from './pages/room-details/RoomDetailsPage/RoomDetailsPage';
import { ConcernIndex } from './pages/concern/ConcernIndex';

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-2-factor" element={<LoginSecondFactor />} />
          <Route path="/login-3-factor" element={<LoginThirdFactor />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-confirmation" element={<SignupConfirmation />} />
          <Route path="/room-details" element={<RoomList />} />
          <Route path="/add-room-details" element={<AddRoomDetails />} />
          <Route path="/update-room-details/:room_id" element={<UpdateRoomDetails />} />
          <Route path="/room-details/:id" element={<RoomDetailsPage />} />
          <Route path="/concerns" element={<ConcernIndex />} />
        </Routes>
        <Footer />
        <ChatBot />
      </Router>
    </>

  );
}

export default App;
