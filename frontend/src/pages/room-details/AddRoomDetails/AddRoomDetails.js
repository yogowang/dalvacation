import React, { useState } from "react";
import { RoomDetailsForm } from "../RoomDetailsForm/RoomDetailsForm";
import { Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddRoomDetails = () => {
    const [roomNumber, setRoomNumber] = useState();
    const [roomType, setRoomType] = useState();
    const [roomPrice, setRoomPrice] = useState();
    const [features, setFeatures] = useState([""]);

    const navigate = useNavigate();

    const onSubmit = async () => {
        const data = {
            room_number: roomNumber,
            room_type: roomType,
            price: roomPrice,
            features: features
        }

        const addRoomDetailsAPIURL = "https://gvaphiixddv2pouk4atyvevpdm0fzpzw.lambda-url.us-east-1.on.aws/";
        const response = await axios.post(addRoomDetailsAPIURL, data);

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
                    onSubmit={onSubmit}
                />
            </div>
        </>
    )
}