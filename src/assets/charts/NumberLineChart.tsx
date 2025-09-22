"use client"

import { CartesianGrid, Line, LineChart, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type ChartDataPoint = {
    time: number
    value: number
}

type NumberLineChartProps = {
    color: string
    data: ChartDataPoint[]
    onDataChange: (data: ChartDataPoint[]) => void
}

export function NumberLineChart({ color, data, onDataChange }: NumberLineChartProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (dialogOpen && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [dialogOpen])

    const chartConfig = {
        value: {
            label: "value",
            color,
        },
    } satisfies ChartConfig

    const handleClick = (e: any) => {
        if (e?.activePayload?.length) {
            const clickedPoint = e.activePayload[0].payload
            const index = data.findIndex((d) => d.time === clickedPoint.time)
            if (index !== -1) {
                setSelectedIndex(index)
                setInputValue(String(data[index].value))
                setDialogOpen(true)
            }
        }
    }

    const handleConfirm = () => {
        if (selectedIndex === null) return
        const newData = [...data]
        newData[selectedIndex] = {
            ...newData[selectedIndex],
            value: inputValue === "" ? 0 : Number(inputValue),
        }
        onDataChange(newData)
        setDialogOpen(false)
    }

    // Find max value for Y axis domain
    const maxValue = Math.max(...data.map((d) => d.value), 1)

    return (
        <div className="min-h-[100px] max-h-32 w-full">
            <ChartContainer config={chartConfig} className="min-h-[100px] max-h-32 w-full">
                <LineChart
                    data={data}
                    margin={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    onClick={handleClick}
                >
                    <YAxis
                        type="number"
                        domain={[0, maxValue]}
                        axisLine={{ stroke: "#ccc" }}
                        tickLine={{ stroke: "#ccc" }}
                    />
                    <CartesianGrid vertical />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line
                        dataKey="value"
                        type="linear"
                        stroke={color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ChartContainer>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Set Value</DialogTitle>
                        </DialogHeader>
                        <Input
                            ref={inputRef}
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter new Y value"
                        />
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Apply</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
