import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SelectInput from "../../../components/input/SelectInput";
import axios from "axios";
import mfaQuestions from "../../../assets/jsonfile/mfaSecurityQuestions.json"
import userRoles from "../../../assets/jsonfile/userRole.json"

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
    const [question, setQuestion] = useState();
    const [answer, setAnswer] = useState();
    const [caeserCipherKey, setCaeserCipherKey] = useState();

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;

    const callSignUp = async () => {
        if (validate()) {
            const userData = {
                user_type: userType.toLowerCase(),
                fullname: name,
                email: email,
                password: password,
                userName: email,
                phone_no: mobileNumber,
                age: age,
                address: address,
                question: question,
                answer: answer,
                key: caeserCipherKey
            };

            console.log(userData);

            const api_signup_url = `${process.env.REACT_APP_BACKEND_URL}/authentication/signup`;

            console.log("backend url: ", api_signup_url);

            const response = await axios.post(api_signup_url, userData);
            console.log(response);

            if (response.data.statusCode === 500) {
                toast.error(response.data.body);
            } else if (response.data.statusCode === 200) {
                localStorage.setItem("email", email)
                navigate("/signup-confirmation")
            } else {
                toast.error("Unable to register")
            }
        }
    }

    const validate = () => {
        if (!name) {
            toast.error("Name is required");
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
        } else if (!question) {
            toast.error("Security Question is required.");
            return false;
        } else if (!answer) {
            toast.error("Answer is required.");
            return false;
        } else if (!caeserCipherKey) {
            toast.error("Caeser Cipher Key is required.");
            return false;
        }

        return true;
    }

    return (
        <>
            <ToastContainer />
            <div className="mt-20 text-center">
                <h1 className="text-primary text-2xl font-bold">Sign Up</h1>
                <div className="my-5 w-full max-w-md space-y-4 mx-auto">
                    <TextInput
                        placeholderText="Name"
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
                        placeholderText="Mobile Number (+1 1234567890)"
                        value={mobileNumber}
                        onChange={(value) => setMobileNumber(value)}
                        type="text"
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
                        optionList={userRoles}
                        value={userType}
                        onChange={(value) => setUserType(value)}
                        listName={"User Type"}
                    />
                    <TextInput
                        placeholderText="Password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        type="password"
                    />
                    <SelectInput
                        optionList={mfaQuestions}
                        value={question}
                        onChange={(value) => setQuestion(value)}
                        listName={"Security Question"}
                    />
                    <TextInput
                        placeholderText="Answer"
                        value={answer}
                        onChange={(value) => setAnswer(value)}
                        type="text"
                    />
                    <TextInput
                        placeholderText="Caeser Cipher Key"
                        value={caeserCipherKey}
                        onChange={(value) => setCaeserCipherKey(value)}
                        type="text"
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
            </div>
        </>
    )
}

export default Signup;
