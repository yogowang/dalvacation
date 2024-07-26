import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../../ApiUrl.js"

const SignupConfirmation = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const [confirmationCode, setConfirmationCode] = useState();

    const callConfirmationCode = async () => {
        if (confirmationCode) {
            const api_confirmation_code_factor_url = `${REACT_APP_BACKEND_URL}/authentication/signup/confirmation`;
            const userData = {
                email: email,
                confirmationCode: confirmationCode,
            };

            console.log("url: ", api_confirmation_code_factor_url);

            const response = await axios.post(
                api_confirmation_code_factor_url,
                userData
            );

            console.log(response);

            if (response.data.statusCode === 200) {
                navigate("/login")
            } else {
                toast.error("Invalid confirmation code");
            }
        } else {
            toast.error("Answer is required");
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="mt-20 text-center">
                <h1 className="text-primary text-2xl font-bold">Email Authentication</h1>
                <p>Enter the confirmation code below sent on your email.</p>
                <div className="my-2 w-full max-w-sm space-y-4 mx-auto">
                    <TextInput placeholderText="Confirmation Code"
                        value={confirmationCode}
                        onChange={(value) => setConfirmationCode(value)}
                        type="text" />
                    <SubmitButton buttonName="Submit" callButtonFunction={callConfirmationCode} />
                </div>
            </div>
        </>
    )
}

export default SignupConfirmation;