"use client"

import { CartesianGrid, Line, LineChart, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Props and Types
type StepLineChartProps = {
    color: string,
    length: number,
    data: ChartDataPoint[],
    onDataChange: (data: ChartDataPoint[]) => void
}
export type ChartDataPoint = {
    time: number;
    value: number;
};

export function StepLineChart({ color, data, onDataChange }: StepLineChartProps) {

    // Chart configuration
    const chartConfig = {
        value: {
            label: "value",
            color: color,
        },
    } satisfies ChartConfig

    const handleClick = (e: any) => {
        if (e && e.activePayload && e.activePayload.length > 0) {
            const clickedPoint = e.activePayload[0].payload
            const index = data.findIndex(
                (d) => d.time === clickedPoint.time
            )

            if (index !== -1) {
                const newData = [...data]
                newData[index] = {
                    ...newData[index],
                    value: newData[index].value === 1 ? 0 : 1,
                }
                onDataChange(newData)
            }
        }
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-[100px] max-h-32 w-full">
            <LineChart
                data={data}
                margin={{
                    top: 12,
                    bottom: 12,
                    left: 12,
                    right: 12,
                }}
                onClick={handleClick}
            >
                <YAxis
                    type="number"
                    domain={[0, 1]}
                    ticks={[0, 1]}
                    axisLine={{ stroke: "#ccc" }}
                    tickLine={{ stroke: "#ccc" }}
                />
                <CartesianGrid vertical={true} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Line
                    dataKey="value"
                    type="stepAfter"
                    stroke={color}
                    strokeWidth={2}
                    dot={true}
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ChartContainer>
    )
}
