import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import SelectInput from "../../../components/input/SelectInput";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import userRoles from "../../../assets/jsonfile/userRole.json"

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [userType, setUserType] = useState();

    const callLogin = async () => {
        if (validate()) {
            const api_login_url = `https://q2di1m9y28.execute-api.us-east-1.amazonaws.com/api/authentication/login/1st`
            const userData = {
                email: email,
                password: password,
                userType: userType,
            };

            console.log("url: ", api_login_url);

            const response = await axios.post(
                api_login_url,
                userData
            );
            console.log(response);

            if (response.data.statusCode === 200) {
                localStorage.setItem("email", email);
                localStorage.setItem("question", response.data.body.userQAQuestion);
                localStorage.setItem("accessToken", response.data.body.authResponse.AuthenticationResult.AccessToken);
                localStorage.setItem("userType", userType);
                navigate("/login-2-factor") //navigate to 2nd factor
            } else {
                toast.error(response.data.body);
            }
        }
    }

    const validate = () => {
        if (!email) {
            toast.error("Email is required");
            return false;
        } else if (!password) {
            toast.error("Email is required");
            return false;
        } else if (!userType || userType === "User Type") {
            toast.error("Select User Type");
            return false;
        }

        return true;
    };

    return (
        <>
            <ToastContainer />
            <div className="mt-20 text-center">
                <h1 className="text-primary text-2xl font-bold">Login</h1>
                <div className="my-5 w-full max-w-sm space-y-4 mx-auto">
                    <TextInput placeholderText="Email"
                        value={email}
                        onChange={(value) => setEmail(value)}
                        type="email" />
                    <TextInput placeholderText="Password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        type="password" />
                    <SelectInput
                        optionList={userRoles}
                        value={userType}
                        onChange={(value) => setUserType(value)}
                        listName={"User Type"}
                    />
                    <SubmitButton buttonName="Login" callButtonFunction={callLogin} />
                    <p className="cursor-pointer text-center">
                        Do not have an account?{" "}
                        <Link to={"/signup"}>
                            <span className="cursor-pointer underline hover:text-gray-400">
                                Register Here
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login;