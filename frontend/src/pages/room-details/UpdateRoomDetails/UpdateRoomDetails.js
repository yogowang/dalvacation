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
        const getRoomDetailsResponse = async () => {
            const getRoomDetailsByRoomIdAPIURL = `https://mdrhqbeyvrep2ndjnr3nwxrnpq0ytxxm.lambda-url.us-east-1.on.aws/?room_id=${room_id}`;

            const response = await axios.get(getRoomDetailsByRoomIdAPIURL);
            
            setRoomNumber(response.data.room_number);
            setRoomType(response.data.room_type);
            setRoomPrice(response.data.price);
            setFeatures(response.data.features);
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

        const updateRoomDetailsAPIURL = "https://ykh4kth4fqliqyixnb6hw24ima0tckjg.lambda-url.us-east-1.on.aws/";
        const response = await axios.put(updateRoomDetailsAPIURL, data);

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