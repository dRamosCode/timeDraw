import { StepLineChart, ChartDataPoint } from "@/assets/charts/StepLineChart";
import { NumberLineChart } from "@/assets/charts/NumberLineChart";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Trash2, GripVertical, RotateCcw } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Props
type TimeDiagramProps = {
    id: number;
    name: string;
    type: string;
    colour: string;
    chartData: ChartDataPoint[];
    isDragging?: boolean;
    onRestart: (id: number) => void;
    onDelete: (id: number) => void;
    onChange: (id: number, changes: Partial<Omit<TimeDiagramProps, "id" | "onDelete" | "onChange">>) => void;
};

export default function TimeDiagram({ id, name, type, colour, chartData, isDragging, onRestart, onDelete, onChange }: TimeDiagramProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    // Block dragging in X direction
    const style = {
        transform: CSS.Transform.toString(
            transform ? { ...transform, x: 0 } : null
        ),
        transition,
        willChange: "transform",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`relative flex flex-row items-center w-full h-44 rounded-xl border bg-white 
                       ${isDragging ? "opacity-50 pointer-events-none border-blue-300 border-2" : "shadow-md"} 
                       transition-all overflow-hidden`}
        >
            {/* Drag handle */}
            <div
                {...listeners}
                className="cursor-grab px-2 flex items-center text-gray-400 hover:text-gray-600 no-export"
            >
                <GripVertical />
            </div>

            {/* Refresh button */}
            <button
                onClick={() => onRestart(id)}
                className="absolute top-2 right-10 p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer no-export"
            >
                <RotateCcw size={18} />
            </button>

            {/* Delete button */}
            <button
                onClick={() => onDelete(id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 hover:cursor-pointer text-red-500 no-export"
            >
                <Trash2 size={18} />
            </button>

            {/* Diagram information */}
            <div className="flex flex-col basis-1/5 h-full px-3 py-2 gap-2 border-r">
                {/* Name */}
                <div className="flex flex-col ">
                    <label className="text-xs text-gray-500">Name</label>
                    <Input
                        className="h-7 text-sm diagramName"
                        placeholder="Enter name..."
                        value={name}
                        onChange={(e) => onChange(id, { name: e.target.value })}
                    />
                </div>

                {/* Data type */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500">Data type</label>
                    <Select
                        value={type}
                        onValueChange={(value) => onChange(id, { type: value })}
                    >
                        <SelectTrigger className="h-7 text-sm">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="diagramType">
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Diagram colour */}
                <div className="flex flex-col no-export">
                    <label className="text-xs text-gray-500">Colour</label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="color"
                            className="h-7 w-10 p-0 border-none cursor-pointer"
                            value={colour}
                            onChange={(e) => onChange(id, { colour: e.target.value })}
                        />
                        <Input
                            type="text"
                            className="h-7 text-xs w-full diagramColour"
                            value={colour}
                            onChange={(e) => onChange(id, { colour: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Diagram */}
            <div className="basis-4/5 px-4 h-full flex items-center justify-center">
                {type === "boolean" ? (
                    <StepLineChart color={colour} length={20} data={chartData} onDataChange={(newData) => onChange(id, { chartData: newData })} />
                ) : (
                    <NumberLineChart color={colour} data={chartData} onDataChange={(newData) => onChange(id, { chartData: newData })} />
                )}
            </div>
        </div>
    );
}
