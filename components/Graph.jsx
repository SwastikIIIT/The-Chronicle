"use client";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { format, subDays, isSameDay, parseISO } from "date-fns";

const LoginActivityGraph = ({ loginHistory = [] }) => {
  // Process data to get last 7 days activity
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return d;
    });

    return last7Days.map((date) => {
      // Count logins for this specific day
      const dayLogins = loginHistory.filter((login) => {
        if (!login.createdAt) return false;
        return isSameDay(parseISO(login.createdAt), date);
      });

      // Count successful vs failed (optional, for potential stacked bars later)
      // For now, we just show total attempts
      return {
        date: format(date, "MMM dd"), // e.g., "Jan 30"
        fullDate: format(date, "yyyy-MM-dd"),
        count: dayLogins.length,
        // Optional: Highlight high activity
        intensity: dayLogins.length > 5 ? "HIGH" : "NORMAL" 
      };
    });
  }, [loginHistory]);

  // Custom Tooltip for the dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-purple-500/30 p-3 rounded-md shadow-xl backdrop-blur-md">
          <p className="text-gray-300 text-xs mb-1">{label}</p>
          <p className="text-white font-bold text-sm">
            <span className="text-purple-400">●</span> {payload[0].value} Login Attempts
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[250px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#333" 
            opacity={0.4} 
          />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }} 
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }} 
            allowDecimals={false}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} />
          
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
            barSize={30}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.count > 10 ? "url(#colorRed)" : "url(#colorPurple)"} // Red if suspicious spike (>10)
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoginActivityGraph;