import React, { useEffect, useState } from "react";
import { ConcernCard } from "./ConcernCard/ConcernCard";
import axios from "axios";
import { RaiseConcernModal } from "./RaiseConcernModal/RaiseConcernModal";

export const ConcernIndex = () => {
    const [concerns, setConcerns] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const email = localStorage.getItem('email');
    const user_type = localStorage.getItem('userType');

    useEffect(() => {
        const getAllConcerns = async () => {
            try {
                const payload = {
                    email
                }
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/concern/getallconcerns`, payload)
                setConcerns(response.data.concerns);
            } catch (error) {
                if (error.response.status === 404) {
                    //not found
                }
            }
        }

        getAllConcerns();
    }, [])

    return (
        <div className="container mx-auto px-5 py-5 mt-20">
            {user_type && user_type === 'customer' &&
                <div className="flex justify-end mb-4">
                    <button className="p-2 bg-blue-500 text-white rounded" onClick={handleOpen}>
                        Raise Concern
                    </button>
                    <RaiseConcernModal open={open} handleOpen={handleOpen} handleClose={handleClose} email={email} />
                </div>
            }

            <div>
                {concerns && concerns.length > 0 ? (
                    concerns.map((concern, index) => (
                        <ConcernCard key={index} concern={concern} user_type={user_type} />
                    ))
                ) : (
                    <p>No concerns found</p>
                )}
            </div>
        </div>
    )
}