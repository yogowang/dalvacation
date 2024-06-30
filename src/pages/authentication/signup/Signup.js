import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SelectInput from "../../../components/input/SelectInput";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [userType, setUserType] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [address, setAddress] = useState();

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    var nameRegex = /^[A-Za-z]+$/;


    const callSignUp = async () => {
        if (validate()) {
            const userData = {
                name: name,
                email: email,
                password: password,
                userType: userType,
                mobileNumber: mobileNumber,
                age: age,
                gender: gender,
                address: address
            };

            const backend_signup_url = ``; //`${process.env.REACT_APP_BACKEND_URL}api/users/signup`;

            console.log("backend url: ", backend_signup_url);

            const response = await axios.post(backend_signup_url, userData);

            if (response.data.statusMessage === "User already exists") {
                toast.error("User already exists");
            } else {
                navigate("/") // navigate to 2nd factor
            }
        }
    }

    const validate = () => {
        if (name === "") {
            toast.error("Name is required");
            return false;
        } else if (!nameRegex.test(name)) {
            toast.error("Name can only have alphabets");
            return false;
        } else if (!email) {
            toast.error("Email is required");
            return false;
        } else if (!emailRegex.test(email)) {
            toast.error("Email is not in valid format");
            return false;
        } else if (!userType || userType === "User Type") {
            toast.error("Select User Type");
            return false;
        } else if (!password) {
            toast.error("Password is required");
            return false;
        } else if (password.length < 7) {
            toast.error("Minimum length of password should be 8 characters.");
            return false;
        } else if (!passwordRegex.test(password)) {
            toast.error(
                <div>
                    <p>Password must fullfil following conditions: </p>
                    <ul>
                        <li>Minimum 1 uppercase alphabet.</li>
                        <li>Minimum 1 lowercase alphabet.</li>
                        <li>Minimum 1 number.</li>
                        <li>Minimum 1 special character (!@#$%^&*).</li>
                    </ul>
                </div>
            );
            return false;
        } else if (!mobileNumber) {
            toast.error("Mobile Number is required.");
            return false;
        } else if (!address) {
            toast.error("Address is required.");
            return false;
        } else if (!age) {
            toast.error("Age is required.");
            return false;
        } else if (!gender) {
            toast.error("Gender is required.");
            return false;
        }

        return true;
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