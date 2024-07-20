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
    const userType = localStorage.getItem("userType");
    const email = localStorage.getItem("email");
    const [roomDetails, setRoomDetails] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [feedback, setFeedback] = useState();
    const [feedBackList, setFeedbackList] = useState([]);

    const getRoomDetailsByRoomIdApiUrl = `${process.env.REACT_APP_BACKEND_URL}/booking/roomdetails`;
    const getFeedbackByRoomIdUrl = `${process.env.REACT_APP_BACKEND_URL}/feedback/getFeedbackByRoomId`;
    const roomBookingApiUrl = `${process.env.REACT_APP_BACKEND_URL}/booking/addcustomerbooking`;
    const feedbackApiUrl = `${process.env.REACT_APP_BACKEND_URL}/feedback/addFeedback`;
    const roomData = { room_id: id.split("=")[1] };
    const feedbackData = { room_id: id.split("=")[1] };

    useEffect(() => {
        const getRoomDetails = async () => {
            const response = await axios.post(getRoomDetailsByRoomIdApiUrl, roomData);
            setRoomDetails(response.data.body);
        };

        getRoomDetails();
        getFeedback();
    }, []);

    const getFeedback = async () => {
        const response = await axios.post(getFeedbackByRoomIdUrl, feedbackData);
        setFeedbackList(response.data.body);
    };

    const callBookRoom = async () => {
        const formattedStartDate = dayjs(startDate).format('MM/DD/YYYY');
        const formattedEndDate = dayjs(endDate).format('MM/DD/YYYY');
        const noOfDays = endDate.diff(startDate, 'day');
        const amount = noOfDays * roomDetails.price;

        if (startDateValidator(formattedStartDate)) {
            toast.error("Start Date cannot be before today's date.");
        } else if (endDateValidator(formattedStartDate, formattedEndDate)) {
            toast.error("End Date cannot be before start date or today's date.");
        } else {
            const bookingData = {
                email: email,
                room_id: roomDetails?.room_id,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                total_days: noOfDays,
                total_amount: amount
            };

            await axios.post(roomBookingApiUrl, bookingData);
            toast("Your booking request is being processed.");
        }
    };

    const startDateValidator = (startDate) => {
        const today = dayjs().startOf('day');
        const selectedDate = dayjs(startDate).startOf('day');
        return selectedDate.isBefore(today);
    };

    const endDateValidator = (startDate, endDate) => {
        const today = dayjs().startOf('day');
        const selectedStartDate = dayjs(startDate).startOf('day');
        const selectedEndDate = dayjs(endDate).startOf('day');
        return selectedEndDate.isBefore(today) && selectedEndDate.isBefore(selectedStartDate);
    };

    const callFeedbackButton = async () => {
        const feedbackData = {
            email: email,
            room_id: roomDetails?.room_id,
            text: feedback
        };

        await axios.post(feedbackApiUrl, feedbackData);
        toast("Thank you for your feedback!");
        setFeedback("");
        getFeedback(); // Fetch the updated feedback list
    };

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
                                <p>{roomDetails?.room_type}</p>
                            </div>
                            <div className="mt-5">
                                <h2 className="text-2xl font-bold mb-2">Price</h2>
                                <p>{roomDetails?.price}</p>
                            </div>
                            <div className="mt-5">
                                <h2 className="text-2xl font-bold mb-2">Features</h2>
                                <ul>
                                    {roomDetails?.features && roomDetails?.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            {userType !== "Property Agent" && (
                                <div className="mt-5">
                                    <h2 className="text-2xl font-bold mb-2">Book Room</h2>
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
                    </div>
                    <div className="my-5 w-1/2">
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

                    <div className="my-5">
                        <h2 className="text-2xl font-bold mb-2">
                            Customer Feedback
                        </h2>
                        <table className="min-w-full bg-white border-collapse block md:table">
                            <thead className="block md:table-header-group">
                                <tr className="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                                    <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Date</th>
                                    <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Email</th>
                                    <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Room ID</th>
                                    <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Sentiment</th>
                                    <th className="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group">
                                {feedBackList.map((feedback, index) => (
                                    <tr key={index} className="bg-gray-100 border border-gray-300 md:border-none block md:table-row">
                                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">{feedback.date}</td>
                                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">{feedback.email || 'N/A'}</td>
                                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">{feedback.room_id || 'N/A'}</td>
                                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">{feedback.sentiment}</td>
                                        <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">{feedback.text}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}

export default RoomDetailsPage