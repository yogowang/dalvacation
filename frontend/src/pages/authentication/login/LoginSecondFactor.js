import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const LoginSecondFactor = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const question = localStorage.getItem("question");
    const [answer, setAnswer] = useState();

    const callSecondFactorAuth = async () => {
        if (answer) {
            const api_login_2_factor_url = `${process.env.REACT_APP_BACKEND_URL}authentication/login/2nd`
            const userData = {
                email: email,
                question: question,
                answer: answer
            };

            console.log("url: ", api_login_2_factor_url);

            const response = await axios.post(
                api_login_2_factor_url,
                userData
            );
            console.log(response);

            if (response.data.statusCode === 200) {
                navigate("/login-3-factor") //navigate to 2nd factor
            } else {
                toast.error(response.data.body);
            }
        } else {
            toast.error("Answer is required");
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="mt-20 text-center">
                <h1 className="text-primary text-2xl font-bold">Login - 2nd Factor Authentication</h1>
                <h2 className="my-3 text-primary text-xl">Please answer the below question as a part of multifactor authentication.</h2>
                <div className="my-5 w-full max-w-sm space-y-4 mx-auto">
                    <p>{question}</p>
                    <TextInput placeholderText="Answer"
                        value={answer}
                        onChange={(value) => setAnswer(value)}
                        type="text" />
                    <SubmitButton buttonName="Submit" callButtonFunction={callSecondFactorAuth} />
                </div>
            </div>
        </>
    )
}

export default LoginSecondFactor;