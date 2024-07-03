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
import { RoomDetailsIndex } from './pages/room-details';
import { AddRoomDetails } from './pages/room-details/AddRoomDetails/AddRoomDetails';
import { UpdateRoomDetails } from './pages/room-details/UpdateRoomDetails/UpdateRoomDetails';

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />

        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-2-factor" element={<LoginSecondFactor />} />
          <Route path="/login-3-factor" element={<LoginThirdFactor />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-confirmation" element={<SignupConfirmation />} />
          <Route path="/room-details" element={<RoomDetailsIndex />} />
          <Route path="/add-room-details" element={<AddRoomDetails />} />
          <Route path="/update-room-details/:room_id" element={<UpdateRoomDetails />} />
          {/*<Route path="/event-list" element={<EventList />} />
          <Route path="/my-events" element={<EventList />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/edit-event/:id" element={<AddEvent />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/customer-profile/:id" element={<CustomerProfile />} />
          <Route
            path="/event-organizer-profile/:id"
            element={<EventOrganizerProfile />}
          />
          <Route path="/payment-success/:id" element={<PaymentSuccess />} />
          <Route path="/payment-failure/:id" element={<PaymentFailure />} />
          <Route
            path="/event-organizer-analytics/:id"
            element={<EventOrganizerAnalytics />}
          /> */}
        </Routes>
        <Footer />
      </Router>
    </>

  );
}

export default App;
