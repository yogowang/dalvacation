import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const RoomDetailsForm = ({ roomNumber, setRoomNumber,
    roomType, setRoomType,
    roomPrice, setRoomPrice,
    features, setFeatures,
    imageBuffer, setImageBuffer,
    onSubmit
}) => {
    const navigate = useNavigate();
    const [roomImage, setRoomImage] = useState("https://cdn.pixabay.com/photo/2021/10/11/00/59/upload-6699084_1280.png")

    const handleRoomPictureChange = (e) => {
        setRoomImage(e.target.files[0]);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBuffer(reader.result); // Convert to Base64 and store
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const validate = () => {
        if (!roomNumber) {
            toast.error("Room number is required");
            return false;
        }
        else if (!roomType) {
            toast.error("Room type is required");
            return false;
        }
        else if (!roomPrice) {
            toast.error("Price is required");
            return false;
        }
        else if (!features || features.some(feature => !feature)) {
            toast.error("Features are required");
            return false;
        }

        return true;
    }

    const handleAddFeature = () => {
        setFeatures([...features, ""]);
    };

    const handleRemoveLastFeature = () => {
        if (features.length > 1) {
            setFeatures(features.slice(0, -1));
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const goBack = () => {
        navigate('/room-details');
    }

    return (
        <>
            <ToastContainer />
            <div className="my-5 w-full max-w-md space-y-4 mx-auto">
                <TextInput
                    placeholderText="Room Number"
                    value={roomNumber}
                    onChange={(value) => setRoomNumber(value)}
                    type="number"
                />
                <TextInput
                    placeholderText="Room Type"
                    value={roomType}
                    onChange={(value) => setRoomType(value)}
                    type="text"
                />
                <TextInput
                    placeholderText="Price"
                    value={roomPrice}
                    onChange={(value) => setRoomPrice(value)}
                    type="number"
                />
                <div className="mb-8 h-fit rounded-lg bg-white p-8 shadow-md">
                    <h2 className="mb-4 text-2xl font-bold">Room Image</h2>
                    {roomImage && (
                        <div className="mt-4">
                            <img
                                src={roomImage}
                                alt="Profile"
                                className="mx-auto object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="profile_picture"
                        name="profile_picture"
                        accept="image/*"
                        className="mt-2 block w-full"
                        onChange={handleRoomPictureChange}
                    />
                </div>

                {features.map((feature, index) => (
                    <TextInput
                        key={index}
                        placeholderText={`Feature ${index + 1}`}
                        onChange={(value) => handleFeatureChange(index, value)}
                        type="text"
                        value={feature}
                    />
                ))}

                <Button
                    onClick={handleAddFeature}
                    variant="outlined">
                    Add Feature
                </Button>
                <Button
                    onClick={handleRemoveLastFeature}
                    variant="outlined"
                    style={{ marginLeft: '10px' }}
                    color="error">
                    Remove Last Feature
                </Button>
                <br />
                <Button
                    onClick={goBack}
                    variant="outlined">
                    Back
                </Button>
                <Button
                    onClick={() => {
                        if (validate()) {
                            onSubmit()
                        }
                    }}
                    style={{ marginLeft: '10px' }}
                    variant="contained">
                    Submit
                </Button>
            </div>
        </>
    )
}