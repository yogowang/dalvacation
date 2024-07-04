import React, { useState, useEffect } from "react";
import background from "../../assets/images/background.jpg";
import { useNavigate } from "react-router-dom";
// import EventCard from "../../components/card/EventCard";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [event, setEvents] = useState([]);
  const backend_all_events_url = `${process.env.REACT_APP_BACKEND_URL}api/events/`;

  const currentDate = new Date();
  // Get year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month starts from 0, so add 1
  const day = String(currentDate.getDate()).padStart(2, "0");

  const todayDate = `${year}-${month}-${day}`;

  const callButtonFunction = () => {
    navigate("/"); //Navigate to Home list
  };

  return (
    <>
      <section
        className="relative h-[80vh] bg-cover bg-center flex justify-center items-center text-center mt-[64px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${background})`,
        }}
      >
        <div class="mx-auto max-w-7xl items-center px-8 py-12 md:px-12 lg:px-16 lg:py-24">
          <div class="max-auto w-full justify-center text-center lg:p-10">
            <span class="mt-8 text-5xl font-medium tracking-tighter text-white">
              <b>DalVacationHome</b>
            </span>
            <br />
            <br />
            <span class="mx-auto mt-2 max-w-xl pt-20 text-3xl tracking-tight text-white">
              Find perfect home for your vacation destinations.
            </span>
            <br />
            <button
              className=" my-2 text-1xl z-5  rounded-lg bg-[#171719] px-8 py-2 text-white shadow-md hover:bg-[#fafafa] hover:text-black disabled:bg-blue-400"
              onClick={callButtonFunction}
            >
              Find Homes
            </button>
          </div>
        </div>
      </section>
      <div className="m-10">
        <h1 className="text-primary text-2xl font-bold text-center">
          New Rooms
        </h1>

      </div>
    </>
  );
};

export default Home;
