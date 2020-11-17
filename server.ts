import express from "express";
import path from "path";

const PORT = parseInt(process.env.PORT || "") || 8080;
const HOSTNAME = process.env.HOST || "0.0.0.0";

const app = express();

app.get("/", (_req, res) => {
    res.sendFile(path.resolve("./public/index.html"));
});

app.get("/:file*", (req, res) => {
    res.sendFile(path.resolve(`./public/${req.params.file}`));
});

app.listen(PORT, HOSTNAME, () =>
    console.log(`Server running on http://${HOSTNAME}:${PORT}`),
);
