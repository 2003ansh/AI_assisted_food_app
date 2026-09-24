const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = gemini.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
});

module.exports = { gemini, model };
