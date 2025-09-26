import { Maximize } from "lucide-react";

export function MaximizeButton() {

    // Function to handle maximize button click
    const handleMaximize = () => {
        window.api.maximize();
    };

    return (
        <div className="h-full hover:bg-gray-200 hover:cursor-pointer">
            <Maximize className="h-full mx-3" onClick={handleMaximize} ></Maximize>
        </div>
    );
}   