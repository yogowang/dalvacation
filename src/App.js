import './App.css';
import Login from './pages/authentication/login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/authentication/signup/Signup';

function App() {
  return (
    <>
      <Router>
        <ToastContainer />


        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
      </Router>
    </>

  );
}

export default App;
