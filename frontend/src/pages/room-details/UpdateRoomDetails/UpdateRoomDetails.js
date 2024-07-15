import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomDetailsForm } from "../RoomDetailsForm/RoomDetailsForm";

export const UpdateRoomDetails = () => {
    const { room_id } = useParams();

    const [roomNumber, setRoomNumber] = useState();
    const [roomType, setRoomType] = useState();
    const [roomPrice, setRoomPrice] = useState();
    const [features, setFeatures] = useState([""]);

    const navigate = useNavigate();

    useEffect(() => {
        const data = {
            room_id: room_id
        }
        const getRoomDetailsResponse = async () => {
            const getRoomDetailsByRoomIdAPIURL = `https://q2di1m9y28.execute-api.us-east-1.amazonaws.com/api/booking/roomdetails`;

            const response = await axios.post(getRoomDetailsByRoomIdAPIURL, data);
            console.log(response.data);

            setRoomNumber(response.data.body.room_number);
            setRoomType(response.data.body.room_type);
            setRoomPrice(response.data.body.price);
            setFeatures(response.data.body.features);
        }

        getRoomDetailsResponse();
    }, [])

    const onSubmit = async () => {
        const data = {
            room_id: room_id,
            room_number: roomNumber,
            room_type: roomType,
            price: roomPrice,
            features: features
        }

        const updateRoomDetailsAPIURL = "https://q2di1m9y28.execute-api.us-east-1.amazonaws.com/api/booking/updateroomdetails";
        const response = await axios.post(updateRoomDetailsAPIURL, data);

        console.log(data);
        navigate('/room-details');
    }

    return (
        <>
            {
                roomNumber && roomType && roomPrice && features &&
                <div className="mt-20">
                    <Typography variant="h4" gutterBottom className="text-center">
                        Update Room Details
                    </Typography>
                    <RoomDetailsForm
                        roomNumber={roomNumber} setRoomNumber={setRoomNumber}
                        roomType={roomType} setRoomType={setRoomType}
                        roomPrice={roomPrice} setRoomPrice={setRoomPrice}
                        features={features} setFeatures={setFeatures}
                        onSubmit={onSubmit}
                    />
                </div>
            }
        </>
    )
}