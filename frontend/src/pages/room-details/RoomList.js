import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/card/RoomCard";
import { REACT_APP_BACKEND_URL } from "../../ApiUrl.js"

export const RoomList = () => {
    const userType = localStorage.getItem("userType")
    const [roomDetails, setRoomDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllRoomDetailsResponse = async () => {
            const getAllRoomDetailsAPIURL = `${REACT_APP_BACKEND_URL}/booking/allroomdetails`;

            const response = await axios.post(getAllRoomDetailsAPIURL);
            console.log("response list: -- ", response.data.body);

            setRoomDetails(response.data.body);
        }

        getAllRoomDetailsResponse();
    }, [])

    const redirectToAddRoomDetails = () => {
        navigate("/add-room-details");
    }

    return (
        <>
            {userType === "Property_Agent" ? (<div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div></div>
                <Button variant="contained" style={{ marginRight: '44px' }} onClick={() => redirectToAddRoomDetails()}>Add Room</Button>
            </div>) : <></>}

            <div className=" mt-20 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 m-4">
                {roomDetails !== undefined && roomDetails?.map((room) => (
                    <div>
                        <RoomCard
                            room_id={room.room_id}
                            image_url={room.image_url}
                            room_type={room.room_type}
                            room_number={room.room_number}
                            price={room.price}
                            features={room.features}
                            link={`/room-details/id=${room.room_id}`}
                        />
                    </div>
                ))}
            </div>

        </>

    )
}