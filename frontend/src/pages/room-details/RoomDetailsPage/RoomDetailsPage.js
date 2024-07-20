import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubmitButton from "../../../components/button/SubmitButton";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from "react-toastify";
import dayjs from 'dayjs';
import TextInput from "../../../components/input/TextInput";

const RoomDetailsPage = () => {
    const { id } = useParams();
    const userType = localStorage.getItem("userType")
    const email = localStorage.getItem("email");
    const [roomDetails, setRoomDetails] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [feedback, setFeedback] = useState();
    const getRoomDetailsByRoomIdApiUrl = `${process.env.REACT_APP_BACKEND_URL}/booking/roomdetails`;
    const roomBookingApiUrl = `${process.env.REACT_APP_BACKEND_URL}/booking/addcustomerbooking`;
    const feedbackApiUrl = `${process.env.REACT_APP_BACKEND_URL}/feedback/addFeedback`;
    const data = {
        room_id: id.split("=")[1]
    }

    useEffect(() => {
        console.log(data);
        const getRoomDetails = async () => {
            const response = await axios.post(getRoomDetailsByRoomIdApiUrl, data);
            console.log("response", response.data.body);

            setRoomDetails(response.data.body);

        }
        console.log("features: ", roomDetails)

        getRoomDetails()
    }, [])

    const callBookRoom = () => {
        const formattedStartDate = dayjs(startDate).format('MM/DD/YYYY');
        const formattedEndDate = dayjs(endDate).format('MM/DD/YYYY')
        const noOfDays = endDate.diff(startDate, 'day');
        const amount = noOfDays * roomDetails.price;

        if (startDateValidator(formattedStartDate)) {
            toast.error("Start Date cannot be before today's date.")
        } else if (endDateValidator(formattedStartDate, formattedEndDate)) {
            toast.error("End Date cannot be before start date or today's date.")
        } else {
            console.log("number of days: ", noOfDays);
            console.log("Total amount: ", amount);
        }

        const bookingData = {
            email: email,
            room_id: roomDetails?.room_id,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            total_days: noOfDays,
            total_amount: amount
        }

        const response = axios.post(roomBookingApiUrl, bookingData);
        toast("You booking request is being processed.")
    }

    const startDateValidator = (startDate) => {
        const today = dayjs().startOf('day');
        const selectedDate = dayjs(startDate).startOf('day');

        return selectedDate.isBefore(today);
    }

    const endDateValidator = (startDate, endDate) => {
        const today = dayjs().startOf('day');
        const selectedStartDate = dayjs(startDate).startOf('day');
        const selectedEndDate = dayjs(endDate).startOf('day');

        return selectedEndDate.isBefore(today) && selectedEndDate.isBefore(selectedStartDate);
    }

    const callFeedbackButton = () => {
        const feedbackData = {
            email: email,
            room_id: roomDetails?.room_id,
            text: feedback
        }

        const response = axios.post(feedbackApiUrl, feedbackData);
        console.log(response);
    }

    return (
        <>
            <ToastContainer />
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
                                    <div className="w-full">
                                        <div className="my-2 grid md:grid-cols-2">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label="Start Date" value={startDate}
                                                        onChange={(startDate) => setStartDate(startDate)} />
                                                </DemoContainer>
                                            </LocalizationProvider>

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker label="End Date" value={endDate}
                                                        onChange={(endDate) => setEndDate(endDate)} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>

                                        <SubmitButton
                                            buttonName="Book Room"
                                            callButtonFunction={callBookRoom}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="my-5">
                            <h2 className="text-2xl font-bold mb-2">Give Feedback</h2>
                            <div className="my-2">
                                <TextInput placeholderText="Write your feedback"
                                    value={feedback}
                                    onChange={(value) => setFeedback(value)}
                                    type="text" />
                            </div>

                            <SubmitButton
                                buttonName="Give Feedback"
                                callButtonFunction={callFeedbackButton}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RoomDetailsPage