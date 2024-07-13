import React, { useState } from "react";
import chatbotImage from "../../assets/images/chatbot.png";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="relative">
                <div className="fixed bottom-4 right-4 z-50">
                    <img
                        src={chatbotImage}
                        alt="Chatbot Button"
                        className="cursor-pointer w-16 h-16 mb-4"
                        onClick={toggleChatbot}
                    />

                    {isOpen && (
                        <div className="absolute bottom-20 right-0">
                            <iframe
                                width="350"
                                height="430"
                                allow="microphone;"
                                src="https://console.dialogflow.com/api-client/demo/embedded/5904befb-fee6-4bdf-b52b-5d26c64e5f35"
                                className="border-0 rounded-lg shadow-lg"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ChatBot;