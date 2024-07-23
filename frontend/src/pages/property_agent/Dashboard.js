import React, { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const email = localStorage.getItem("email")
    const data = { "agentEmail": email }
    const dashboardDataUrl = `${process.env.REACT_APP_BACKEND_URL}/reload-lookerstudio-data`
    useEffect(() => {
        const getLookerStudioData = async () => {
            await axios.post(dashboardDataUrl, data);
        }

        getLookerStudioData()
    })
    return (<>
        <div classname="mt-20">
            <iframe className="w-full h-[100vh] mt-[40px]" src="https://lookerstudio.google.com/embed/reporting/245b4665-f357-4ee4-87ae-2fb363ee0a08/page/8se6D" frameborder="0" allowfullscreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
        </div>
    </>)
}

export default Dashboard;