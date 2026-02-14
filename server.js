import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   🔎 SEARCH
========================= */
app.get("/search", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  exec(
    `yt-dlp "ytsearch10:${q}" --dump-json --flat-playlist`,
    { maxBuffer: 1024 * 1024 * 10 },
    (err, stdout) => {
      if (err) return res.json([]);

      const lines = stdout.trim().split("\n");

      const results = lines.map(line => {
        const data = JSON.parse(line);
        return {
          id: data.id,
          title: data.title,
          duration: data.duration
        };
      });

      res.json(results);
    }
  );
});

/* =========================
   ▶ STREAM MP4
========================= */
app.get("/stream", (req, res) => {
  const id = req.query.id;
  if (!id) return res.json({});

  exec(
    `yt-dlp -f 18 -g https://www.youtube.com/watch?v=${id}`,
    (err, stdout) => {
      if (err) return res.json({});

      res.json({
        url: stdout.trim()
      });
    }
  );
});

/* ========================= */

app.listen(PORT, () => {
  console.log("YT Backend Running on port", PORT);
});