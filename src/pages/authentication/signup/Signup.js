import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SelectInput from "../../../components/input/SelectInput";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [userType, setUserType] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [address, setAddress] = useState();



    const callSignUp = () => {
        console.log(email);
    }
    return (
        <>
            <ToastContainer />
            <div className="mt-20 text-center">
                <h1 className="text-primary text-2xl font-bold">Sign Up</h1>
                <div className="mx-auto my-2 w-3/4 p-2 text-center md:w-1/2 lg:w-1/4">
                    <TextInput
                        placeholderText="Name"
                        value={name}
                        onChange={(value) => setName(value)}
                        type="text"
                    />
                    <TextInput
                        placeholderText="Email"
                        value={email}
                        onChange={(value) => setEmail(value)}
                        type="email"
                    />

                    <TextInput
                        placeholderText="Mobile Number"
                        value={mobileNumber}
                        onChange={(value) => setMobileNumber(value)}
                        type="number"
                    />

                    <TextInput
                        placeholderText="Age"
                        value={age}
                        onChange={(value) => setAge(value)}
                        type="number"
                    />

                    <TextInput
                        placeholderText="Gender"
                        value={gender}
                        onChange={(value) => setGender(value)}
                        type="text"
                    />

                    <TextInput
                        placeholderText="Address"
                        value={address}
                        onChange={(value) => setAddress(value)}
                        type="text"
                    />

                    <SelectInput
                        value={userType}
                        onChange={(value) => setUserType(value)}
                    />

                    <TextInput
                        placeholderText="Password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        type="password"
                    />

                    <SubmitButton buttonName="Signup" callButtonFunction={callSignUp} />
                    <p className="cursor-pointer text-center">
                        Already ave an account?{" "}
                        <Link to={"/login"}>
                            <span className="cursor-pointer underline hover:text-gray-400">
                                Login Here
                            </span>
                        </Link>
                    </p>
                </div>
            </div >
        </>
    )
}

export default Signup;