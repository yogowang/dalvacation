import SubmitButton from "../button/SubmitButton";
import { Link } from "react-router-dom";

const HomePageRoom = ({ imageUrl, name, location, price }) => {

    const callButtonFunction = () => {
        console.log("Button called");
    }

    return (
        <><div className="bg-[#e6f9ff] max-w-sm border-2 rounded-xl overflow-hidden shadow-md mx-auto">
            <img className="w-full h-52" src={imageUrl} alt={name} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name}</div>
                <p className="text-gray-700 text-base mb-2">Location: {location}</p>
                <p className="text-gray-700 text-base mb-2">Price: {price}</p>
                <Link >
                    <SubmitButton
                        buttonName="View Details"
                        callButtonFunction={callButtonFunction}
                    />
                </Link>
            </div>
        </div ></>
    )
}

export default HomePageRoom