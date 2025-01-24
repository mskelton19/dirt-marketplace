import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface OverviewProps {
  data: Array<{
    date: string
    [key: string]: number | string
  }>
}

export function Overview({ data }: OverviewProps) {
  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleString("default", { month: "short" })
  }

  const materialTypes = Object.keys(data[0]).filter((key) => key !== "date" && key !== "total")
  const colors = ["#3b82f6", "#f97316", "#0ea5e9", "#f59e0b", "#6366f1"]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDate}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #ccc" }}
          labelFormatter={formatDate}
          formatter={(value: number, name: string) => [`${value.toLocaleString()} units`, name]}
        />
        <Legend />
        {materialTypes.map((material, index) => (
          <Bar
            key={material}
            dataKey={material}
            stackId="a"
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

