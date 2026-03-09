import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

function calculateStreak(dates: string[]) {
  const sorted = dates.sort()
  const today = new Date()

  let streak = 0

  for (let i = sorted.length - 1; i >= 0; i--) {
    const d = new Date(sorted[i])

    const diff =
      Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export default function handler(req: Request) {

  const { searchParams } = new URL(req.url)

  const habitParam = searchParams.get('habit') || ""
  const habit = habitParam ? habitParam.split(",") : []

  const streak = calculateStreak(habit)

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = today.toLocaleString("default", { month: "long" })

  const dots = []

  for (let day = 1; day <= daysInMonth; day++) {

    const dateStr =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0")

    const completed = habit.includes(dateStr)

    dots.push(
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: completed ? "#ff6a3d" : "#555",
        }}
      />
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1170px",
          height: "2532px",
          background: "black",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 60
        }}
      >

        <div style={{ fontSize: 80 }}>
          {monthName} {year}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 40px)",
            gap: 20
          }}
        >
          {dots}
        </div>

        <div style={{ fontSize: 90 }}>
          🔥 {streak} Day Streak
        </div>

      </div>
    ),
    {
      width: 1170,
      height: 2532,
    }
  )
}
