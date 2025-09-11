import express from "express";
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Minimal server live on port ${PORT}`);
});
