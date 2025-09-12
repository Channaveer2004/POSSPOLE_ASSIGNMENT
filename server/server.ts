import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());


app.get("/", (req, res) => {
  res.send("Backend is working.....!!!! noiceeee after long timeee");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
