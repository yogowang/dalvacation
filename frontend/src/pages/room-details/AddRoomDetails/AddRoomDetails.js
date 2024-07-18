import React, { useState } from "react";
import { RoomDetailsForm } from "../RoomDetailsForm/RoomDetailsForm";
import { Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddRoomDetails = () => {
    const agent_email = localStorage.getItem("email")
    const [roomNumber, setRoomNumber] = useState();
    const [roomType, setRoomType] = useState();
    const [roomPrice, setRoomPrice] = useState();
    const [features, setFeatures] = useState([""]);
    const [imageBuffer, setImageBuffer] = useState();
    const file_type = "jpeg";

    const navigate = useNavigate();

    const onSubmit = async () => {
        const data = {
            agent_email: agent_email,
            room_number: roomNumber,
            room_type: roomType,
            price: roomPrice,
            features: features,
            file_content_base64: imageBuffer.split(",")[1],
            file_type: file_type
        }

        console.log("data:", data);
        const addRoomDetailsAPIURL = `${process.env.REACT_APP_BACKEND_URL}booking/addroomdetails`;
        const response = await axios.post(addRoomDetailsAPIURL, data);
        console.log(response);

        navigate('/room-details');
    }

    return (
        <>
            <div className="mt-20">
                <Typography variant="h4" gutterBottom className="text-center">
                    Add Room Details
                </Typography>
                <RoomDetailsForm
                    roomNumber={roomNumber} setRoomNumber={setRoomNumber}
                    roomType={roomType} setRoomType={setRoomType}
                    roomPrice={roomPrice} setRoomPrice={setRoomPrice}
                    features={features} setFeatures={setFeatures}
                    imageBuffer={imageBuffer} setImageBuffer={setImageBuffer}
                    onSubmit={onSubmit}
                />
            </div>
        </>
    )
}