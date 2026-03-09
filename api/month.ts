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

  const monthName = today.toLocaleString("default", { month: "long" })

  const daysInMonth = new Date(year, month + 1, 0).getDate()

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
      `<div style="
        width:20px;
        height:20px;
        border-radius:50%;
        background:${completed ? "#ff6a3d" : "#555"};
      "></div>`
    )
  }

  const html = `
  <div style="
    width:1170px;
    height:2532px;
    background:black;
    color:white;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:60px;
    font-family:sans-serif;
  ">

    <div style="font-size:80px;">
      ${monthName} ${year}
    </div>

    <div style="
      display:grid;
      grid-template-columns:repeat(7,40px);
      gap:20px;
    ">
      ${dots.join("")}
    </div>

    <div style="font-size:90px;">
      🔥 ${streak} Day Streak
    </div>

  </div>
  `

  return new ImageResponse(html, {
    width: 1170,
    height: 2532,
  })
}
