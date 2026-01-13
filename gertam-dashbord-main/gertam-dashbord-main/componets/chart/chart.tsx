"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {ChartData} from "recharts/types/state/chartDataSlice";



export default function Chart({data}: {data: ChartData}) {
    return (
        <div className=" h-96 bg-white  rounded-2xl  p-5 m-10">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 ">
                إحصائيات الأداء
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#000" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                        type="monotone"
                        dataKey="uv"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
