import { useState } from "react";
import { CirclePlus } from "lucide-react";
import TimeDiagram from "./features/timeDiagram/TimeDiagram";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import MenuBar from "./features/menuBar/MenuBar";
import { ChartDataPoint } from "./assets/charts/StepLineChart";
import { Input } from "./components/ui/input";

// Types
export type Diagram = {
  id: number;
  name: string;
  type: string;
  colour: string;
  chartData: ChartDataPoint[];
};

// Function to initialize chart data
export function generateChartData(length: number): ChartDataPoint[] {
  return Array.from({ length }, (_, i) => ({
    time: i + 1,
    value: 0,
  }));
}

function App() {

  const [diagrams, setDiagrams] = useState<Diagram[]>([{
    id: 1,
    name: "",
    type: "boolean",
    colour: "#555555",
    chartData: generateChartData(20),
  }]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Function to add a new diagram
  const addDiagram = () => {
    // Get all IDs in use
    const ids = diagrams.map((d) => d.id);
    let newId = 1;

    // Check if nextId is in use, if so increment and check again
    while (ids.includes(newId)) newId++;
    setDiagrams((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        type: "boolean",
        colour: "#555555",
        chartData: generateChartData(20),
      },
    ]);
  };

  // Function to restart a diagram
  const restartDiagram = (id: number) => {
    setDiagrams((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
            ...d,
            chartData: generateChartData(d.chartData.length),
          }
          : d
      )
    );
  };

  // Function to delete a diagram
  const deleteDiagram = (id: number) => {
    setDiagrams((prev) => prev.filter((d) => d.id !== id));
  };

  // Function to update a diagram data
  const updateDiagram = (id: number, changes: Partial<Diagram>) => {
    setDiagrams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...changes } : d))
    );
  };

  // Handlers for drag events
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  // Handle drag end and reorder items
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDiagrams((items) => {
        const oldIndex = items.findIndex((d) => d.id === active.id);
        const newIndex = items.findIndex((d) => d.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <div>
      {/* Menu bar*/}
      <MenuBar title={title} diagrams={diagrams} setDiagrams={setDiagrams} setTitle={setTitle} />

      {/* Title */}
      <Input
        className="mx-5 mt-13 w-4/5 md:w-2/3 lg:w-1/3 font-bold select-none bg-white"
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Main drag-and-drop container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={diagrams.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* App content */}
          <div
            id="app-content"
            className="w-full p-5 space-y-3 max-h-screen"
          >
            {diagrams.map((diagram) => (
              <TimeDiagram
                key={diagram.id}
                {...diagram}
                onRestart={restartDiagram}
                onDelete={deleteDiagram}
                onChange={updateDiagram}
                isDragging={activeId === diagram.id}
              />
            ))}
          </div>
        </SortableContext>

        {/* Show nothing while dragging under the mouse */}
        <DragOverlay>
          <div className="w-0 h-0" />
        </DragOverlay>
      </DndContext>

      {/*Add diagram button*/}
      <Tooltip>
        <TooltipTrigger asChild>
          <CirclePlus
            onClick={addDiagram}
            className="fixed bottom-5 right-5 fill-white stroke-blue-500 size-15 drop-shadow-gray-400 drop-shadow-sm hover:drop-shadow-lg hover:drop-shadow-gray-400 hover:scale-105 transition-all hover:cursor-pointer"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new diagram</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default App;
