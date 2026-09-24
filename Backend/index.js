const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDB } = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
