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
import { Diagram, generateChartData } from "@/App";
import { CloseButton } from "./CloseButton";
import { MaximizeButton } from "./MaximizeButton";
import { MinimizeButton } from "./MinimizeButton";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

    const [version, setVersion] = useState("");

    useEffect(() => {
        window.api.getAppVersion().then(setVersion);
    }, []);


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
        // Delete all diagrams
        setDiagrams([]);
        // Add a new empty diagram
        setDiagrams((prev) => [
            ...prev,
            {
                id: 1,
                name: "",
                type: "boolean",
                colour: "#555555",
                chartData: generateChartData(20),
            },
        ]);
    };

    return (
        <div id="menuBar" className="fixed top-0 left-0 w-full h-10 bg-white z-99 flex items-center content-stretch gap-2 border-b-2 app-region: drag;">
            {/* Logo */}
            <Dialog >
                <DialogTrigger asChild>
                    <img src={`${import.meta.env.BASE_URL}images/icon.png`} alt="logo" className="h-6 mx-3 hover:cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="flex flex-col items-center">
                        <img src={`${import.meta.env.BASE_URL}images/icon.png`} alt="logo" className="w-30 items-center drop-shadow-lg/25" />
                        <DialogTitle className="text-center font-[Poppins] font-bold text-2xl">TimeDraw</DialogTitle>
                        <DialogTitle className="text-center font-regular text-sm">dRamosCode </DialogTitle>
                        <DialogTitle className="text-center font-light text-sm bg-secondary py-2 px-4 rounded-full text-primary">Version {version} </DialogTitle>
                        <DialogDescription className="text-center">
                            This project is open source and all contributions are welcome. <br />
                            Visit <i>https://github.com/dRamosCode/TimeDraw</i> for more information.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {/* New file */}
            <AlertDialog >
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
            {/* Window controls */}
            <div className="ml-auto flex h-full items-center">
                <MinimizeButton></MinimizeButton>
                <MaximizeButton></MaximizeButton>
                <CloseButton></CloseButton>
            </div>
        </div>
    );
}
