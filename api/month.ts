export default function handler(req: any, res: any) {

  const habit = req.query.habit
    ? req.query.habit.split(",")
    : [];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const daysInMonth = new Date(year, month, 0).getDate();

  function calculateStreak(dates: string[]) {

    const sorted = dates.sort();
    let streak = 0;

    for (let i = sorted.length - 1; i >= 0; i--) {

      const d = new Date(sorted[i]);

      const diff =
        Math.floor(
          (today.getTime() - d.getTime()) /
          (1000 * 60 * 60 * 24)
        );

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  const streak = calculateStreak(habit);

  let dots = "";

  for (let day = 1; day <= daysInMonth; day++) {

    const dateStr =
      `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const completed = habit.includes(dateStr);

    const color = completed ? "#ff6a3d" : "#555";

    const col = (day - 1) % 7;
    const row = Math.floor((day - 1) / 7);

    const x = col * 120 + 250;
    const y = row * 120 + 600;

    dots += `
      <circle cx="${x}" cy="${y}" r="18" fill="${color}" />
    `;
  }

  const monthName = today.toLocaleString("default", { month: "long" });

  const svg = `
  <svg width="1170" height="2532" xmlns="http://www.w3.org/2000/svg">

    <rect width="100%" height="100%" fill="black"/>

    <text x="585" y="250"
          fill="white"
          font-size="80"
          text-anchor="middle"
          font-family="sans-serif">
      ${monthName} ${year}
    </text>

    ${dots}

    <text x="585" y="2100"
          fill="white"
          font-size="90"
          text-anchor="middle"
          font-family="sans-serif">
      🔥 ${streak} Day Streak
    </text>

  </svg>
  `;

  res.setHeader("Content-Type","image/svg+xml");
  res.status(200).send(svg);
}
