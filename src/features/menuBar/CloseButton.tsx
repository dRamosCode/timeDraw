import { X } from "lucide-react";

export function CloseButton() {

    // Function to handle close button click
    const handleClose = () => {
        window.api.close();
    };

    return (
        <div className="h-full hover:bg-red-600 hover:cursor-pointer">
            <X className="h-full mx-3" onClick={handleClose} ></X>
        </div>
    );
}   