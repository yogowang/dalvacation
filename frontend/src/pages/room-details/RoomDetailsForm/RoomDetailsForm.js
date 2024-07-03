import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const RoomDetailsForm = ({ roomNumber, setRoomNumber,
    roomType, setRoomType,
    roomPrice, setRoomPrice,
    features, setFeatures,
    onSubmit
}) => {
    const navigate = useNavigate();

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
                onClick={onSubmit}
                style={{ marginLeft: '10px' }}
                variant="contained">
                Submit
            </Button>
        </div>
    )
}