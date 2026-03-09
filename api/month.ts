import { createCanvas } from "canvas";

function calculateStreak(dates: string[]) {

  const sorted = dates.sort();
  const today = new Date();

  let streak = 0;

  for (let i = sorted.length - 1; i >= 0; i--) {

    const d = new Date(sorted[i]);

    const diff =
      Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function handler(req: any, res: any) {

  const width = parseInt(req.query.width || "1170");
  const height = parseInt(req.query.height || "2532");

  const habit = (req.query.habit || "").split(",");

  const streak = calculateStreak(habit);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dot = 22;
  const gap = 26;

  let xStart = width / 2 - 180;
  let yStart = height / 2 - 200;

  let day = 1;

  for (let row = 0; row < 6; row++) {

    for (let col = 0; col < 7; col++) {

      if (row === 0 && col < startWeekday) continue;
      if (day > daysInMonth) continue;

      const dateStr =
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0");

      if (habit.includes(dateStr)) {
        ctx.fillStyle = "#ff6a3d";
      } else {
        ctx.fillStyle = "#666";
      }

      const x = xStart + col * (dot + gap);
      const y = yStart + row * (dot + gap);

      ctx.beginPath();
      ctx.arc(x, y, dot / 2, 0, Math.PI * 2);
      ctx.fill();

      day++;
    }
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "64px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText(`🔥 ${streak} Day Streak`, width / 2, height - 250);

  ctx.fillStyle = "#888";
  ctx.font = "40px sans-serif";

  const monthName = today.toLocaleString("default", { month: "long" });

  ctx.fillText(monthName + " " + year, width / 2, 200);

  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer());
}