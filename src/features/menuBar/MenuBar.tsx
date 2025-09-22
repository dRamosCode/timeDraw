import { Camera, FolderOpen, Save, File } from "lucide-react";
import * as htmlToImage from "html-to-image";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Diagram } from "@/App";

// Props
type MenuBarProps = {
    title: string;
    diagrams: Diagram[];
    setDiagrams: React.Dispatch<React.SetStateAction<Diagram[]>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
};

// Function to render app content as image
const handleRender = async () => {
    const node = document.getElementById("app-content");
    if (!node) return;

    try {
        const dataUrl = await htmlToImage.toJpeg(node, {
            quality: 0.95,
            backgroundColor: "#ffffff",
            width: node.scrollWidth,
            height: node.scrollHeight,
            style: { transform: "scale(1)", transformOrigin: "top left" },
            // Do not render elements with the class 'no-export'
            filter: (el) => !(el instanceof HTMLElement && el.classList.contains("no-export")),
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "TimeDraw.jpg";
        link.click();
    } catch (err) {
        console.error("Error generating image:", err);
    }
};

export default function MenuBar({ title, diagrams, setDiagrams, setTitle }: MenuBarProps) {

    // Save JSON
    const handleSave = () => {
        const json = JSON.stringify({ title, diagrams }, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "TimeDraw.json";
        link.click();

        URL.revokeObjectURL(url);
    };

    // Load JSON
    const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const loaded = JSON.parse(ev.target?.result as string);
                setDiagrams(loaded.diagrams);
                setTitle(loaded.title);
            } catch (err) {
                console.error("Error parsing JSON:", err);
            }
        };
        reader.readAsText(file);

        // Reset input so same file can be selected again later
        e.target.value = "";
    };

    // New file
    const handleNew = () => {
        setDiagrams([]);
        setTitle("");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-fit p-2 bg-white z-99 flex items-center gap-2 border-b-2">
            {/* New file */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <File className="hover:cursor-pointer hover:text-blue-600 transition-all" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>New</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create a new file?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your current diagrams and start a new file from scratch.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="hover:cursor-pointer" onClick={handleNew}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Open file */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <label className="hover:cursor-pointer">
                        <FolderOpen className="hover:text-blue-600 transition-all" />
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={handleOpen}
                        />
                    </label>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Open</p>
                </TooltipContent>
            </Tooltip>
            {/* Save file */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Save className="hover:cursor-pointer hover:text-blue-600 transition-all" onClick={handleSave}></Save>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Save</p>
                </TooltipContent>
            </Tooltip>
            {/* Render image */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Camera className="hover:cursor-pointer hover:text-blue-600 transition-all" onClick={handleRender}></Camera>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Take snapshot</p>
                </TooltipContent>
            </Tooltip>
        </div >
    );
}
