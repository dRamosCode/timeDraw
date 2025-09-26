import { Minus } from "lucide-react";

export function MinimizeButton() {

    // Function to handle minimize button click
    const handleMinimize = () => {
        window.api.minimize();
    };

    return (
        <div className="h-full hover:bg-gray-200 hover:cursor-pointer">
            <Minus className="h-full mx-3" onClick={handleMinimize} ></Minus>
        </div>
    );
}   