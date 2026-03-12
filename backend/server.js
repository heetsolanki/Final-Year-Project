const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
  });

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "LawAssist Backend Running 🚀" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/expert", require("./routes/expertRoutes"));
app.use("/api/laws", require("./routes/lawRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully running!`);
});
