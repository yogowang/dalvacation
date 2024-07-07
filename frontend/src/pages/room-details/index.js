import React, { useEffect, useState } from "react";
import { RoomDetailsCard } from "./RoomDetailsCard";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const RoomDetailsIndex = () => {
    const [roomDetails, setRoomDetails] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const getAllRoomDetailsResponse = async () => {
            const getAllRoomDetailsAPIURL = "https://3hp2as7h6t4vibsnfgmto5agze0vxfkq.lambda-url.us-east-1.on.aws/";

            const response = await axios.get(getAllRoomDetailsAPIURL);

            setRoomDetails(response.data);
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
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {roomDetails && roomDetails.map((room) => (
                    <RoomDetailsCard key={room.room_id} room={room} />
                ))}
            </div>
        </>

    )
}