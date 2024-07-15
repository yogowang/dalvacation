import SubmitButton from "../button/SubmitButton";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DeleteRoomDetails } from '../../pages/room-details/DeleteRoomDetails/DeleteRoomDetails';

const RoomCard = ({ room_id, image_url, room_number, room_type, price, features }) => {
    const userType = localStorage.getItem("userType")
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const redirectToUpdateRoomDetails = () => {
        navigate(`/update-room-details/${room_id}`);
    }

    const callButtonFunction = () => {
        console.log("Button called");
    }

    return (

        <> <div className="bg-[#e6f9ff] max-w-sm border-2 rounded-xl overflow-hidden shadow-md mx-auto">
            <img className="w-full h-52" src={image_url} alt={room_type} />
            {console.log("image url: ", image_url)}
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Room Number: {room_number}</div>
                <p className="text-gray-700 text-base mb-2">Room Type: {room_type}</p>
                <p className="text-gray-700 text-base mb-2">Price: {price}</p>
                <Typography variant="body2">
                    Features:
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </Typography>
                <Link >
                    <SubmitButton
                        buttonName="View Details"
                        callButtonFunction={callButtonFunction}
                    />
                </Link>
                {userType === "Property_Agent" ? (<>
                    < Button size="small" onClick={() => redirectToUpdateRoomDetails()}>Update</Button>
                    <Button size="small" color="error" onClick={handleOpen}>Delete</Button>
                    <DeleteRoomDetails open={open} handleClose={handleClose} room_id={room_id} room_number={room_number} /></>) : <></>}
            </div>
        </div ></>
    )
}

export default RoomCard