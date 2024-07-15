import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubmitButton from "../../../components/button/SubmitButton";
import TextInput from "../../../components/input/TextInput";

const RoomDetailsPage = () => {
    const { id } = useParams();
    const userType = localStorage.getItem("userType")
    const email = localStorage.getItem("email")
    const [roomDetails, setRoomDetails] = useState();
    const [noOfDays, setNoOfDays] = useState();
    const getRoomDetailsByRoomIdAPIURL = `https://q2di1m9y28.execute-api.us-east-1.amazonaws.com/api/booking/roomdetails`;
    const data = {
        room_id: id.split("=")[1]
    }

    useEffect(() => {
        const getRoomDetails = async () => {
            const response = await axios.post(getRoomDetailsByRoomIdAPIURL, data);
            console.log(response.data.body);

            setRoomDetails(response.data.body);
            console.log("features: ", roomDetails?.features)
        }

        getRoomDetails()
    }, [])

    const callBookRoom = () => { }


    return (<>
        <div className="my-20 w-full px-10">
            <div className="w-full mx-auto p-8 rounded-lg">
                <img
                    className="h-[60vh] mb-6 mx-auto"
                    src={roomDetails?.image_url}
                    alt={roomDetails?.room_number}
                />

                <h1 className="text-4xl font-bold mb-4">Room Number: {roomDetails?.room_number}</h1>

                <div className="grid md:grid-cols-2">
                    <div>
                        <div className="mt-5">
                            <h2 className="text-2xl font-bold mb-2">Room Type</h2>
                            <p>
                                {roomDetails?.room_type}
                            </p>
                        </div>

                        <div className="mt-5">
                            <h2 className="text-2xl font-bold mb-2">Price</h2>
                            <p>
                                {roomDetails?.price}
                            </p>
                        </div>

                        <div className="mt-5">
                            <h2 className="text-2xl font-bold mb-2">Features</h2>
                            <ul>
                                {roomDetails?.features && roomDetails?.features.map((feature) => (
                                    <li>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        {userType === "Property Agent" ? (
                            ""
                        ) : (
                            <div className="mt-5">
                                <h2 className="text-2xl font-bold mb-2">
                                    Book Room
                                </h2>
                                <div className="w-full md:w-1/2">
                                    <TextInput
                                        placeholderText="Number of Days"
                                        value={noOfDays}
                                        onChange={(value) => setNoOfDays(value)}
                                        type="number"
                                        min="0"
                                    />
                                    <SubmitButton
                                        className="my-5"
                                        buttonName="Book Room"
                                        callButtonFunction={callBookRoom}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default RoomDetailsPage