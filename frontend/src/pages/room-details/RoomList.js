import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/card/RoomCard";

export const RoomList = () => {
    const [roomDetails, setRoomDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllRoomDetailsResponse = async () => {
            const getAllRoomDetailsAPIURL = `${process.env.REACT_APP_BACKEND_URL}/booking/allroomdetails`;

            const response = await axios.post(getAllRoomDetailsAPIURL);
            console.log("response list: -- ", response.data.body[2].image_url);

            setRoomDetails(response.data.body);
        }

        getAllRoomDetailsResponse();
    }, [])

    const redirectToAddRoomDetails = () => {
        navigate("/add-room-details");
    }

    return (
        <>
            <div className="mt-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div></div>
                <Button variant="contained" style={{ marginRight: '44px' }} onClick={() => redirectToAddRoomDetails()}>Add Room</Button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 m-4">
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