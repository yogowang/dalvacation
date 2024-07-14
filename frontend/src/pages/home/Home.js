import React from "react";
import background from "../../assets/images/background.jpg";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/card/RoomCard";

const Home = () => {
  const navigate = useNavigate();

  const callButtonFunction = () => {
    navigate("/"); //Navigate to Room list
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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 m-4">
          <RoomCard room_number="13" room_type="HRM Delux Rooms" image_url="https://img.freepik.com/free-photo/3d-rendering-beautiful-comtemporary-luxury-bedroom-suite-hotel-with-tv_105762-2064.jpg?t=st=1720111289~exp=1720114889~hmac=345256e6594cd2cbe4a755fee376e873ee84e0878f3c175cc5c40b50753c8aa7&w=1800" price="300" features={['TV', 'GYM']} />
          <RoomCard room_number="507" room_type="Sydney Rooms" image_url="https://img.freepik.com/free-photo/3d-contemporary-living-room-interior-modern-furniture_1048-10264.jpg?t=st=1720112674~exp=1720116274~hmac=5a9df47e52e7bd72da0944eb36d5dbe8b88cb66db39388b53a4b83ca1f417a58&w=2000" price="100" features={['TV', 'GYM']} />
          <RoomCard room_number="902" room_type="HRM Standard Rooms" image_url="https://img.freepik.com/free-psd/modern-interior-design-living-room_176382-1265.jpg?t=st=1720112372~exp=1720115972~hmac=b078386b7e380cc2f8a7a364c0ed5d94ef045ae7333a5caad5c723d8bee2b0ba&w=2000" location="Halifax" price="100 CAD/night" features={['TV', 'GYM']} />
          <RoomCard room_number="1003" room_type="NS Rooms" image_url="https://img.freepik.com/free-photo/modern-empty-room_23-2150528561.jpg?t=st=1720112731~exp=1720116331~hmac=b4ddee161f114580be16f72753dd519040b69b14bf7eaaac83175db945009203&w=2000" location="Halifax" price="200 CAD/night" features={['TV', 'GYM']} />
        </div>
      </div>
    </>
  );
};

export default Home;
