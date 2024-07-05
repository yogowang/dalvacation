import React, { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import SubmitButton from "../../../components/button/SubmitButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
const randomWord = generateRandomWord();

const LoginThirdFactor = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const [decryptedWord, setDecryptedWord] = useState();

    const callThirdFactorAuth = async () => {
        if (decryptedWord) {
            const api_login_3_factor_url = `https://qz7jhm2dvd.execute-api.us-east-1.amazonaws.com/login-factor-three/authentication/login/3rd`
            const userData = {
                email: email,
                word: randomWord,
                decryptedWord: decryptedWord
            };

            console.log("url: ", api_login_3_factor_url);

            const response = await axios.post(
                api_login_3_factor_url,
                userData
            );

            console.log(response);

            if (response.data.statusCode === 200) {
                navigate("/") //navigate to home
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
                <h1 className="text-primary text-2xl font-bold">Login - 3rd Factor Authentication</h1>
                <h2 className="my-3 text-primary text-xl">Please decrypt the below word using the Caeser Cipher key you selected at the time of Signup.</h2>
                <span className="text-sm text-gray-600">
                    Example: If the encrypted word is <b>"abcd"</b> and the key is <b>3</b>, then the decrypted word is <b>"xyza"</b> (a - 3 = x, b - 3 = y, c - 3 = z, d - 3 = a).
                </span>
                <div className="my-5 w-full max-w-sm space-y-4 mx-auto">
                    <p>Decrypt the given random word: <b>{randomWord}</b></p>
                    <TextInput placeholderText="Decrypted Word"
                        value={decryptedWord}
                        onChange={(value) => setDecryptedWord(value)}
                        type="text" />
                    <SubmitButton buttonName="Submit" callButtonFunction={callThirdFactorAuth} />
                </div>
            </div>
        </>)
}

function generateRandomWord() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let word = '';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        word += letters[randomIndex];
    }

    return word;
}

console.log(generateRandomWord());

export default LoginThirdFactor;