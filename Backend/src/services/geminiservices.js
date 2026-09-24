const { model } = require("../config/gemini");
const {
  INTENT_SYSTEM_PROMPT,
  RESPONSE_SYSTEM_PROMPT,
} = require("../utils/geminiPromt");
const { AppError } = require("../utils/errors");

/**
 * All Gemini I/O lives here: send prompts, retrieve text, parse JSON.
 */

function extractText(result) {
  const text = result?.response?.text?.();
  if (!text || typeof text !== "string") {
    throw new AppError("Empty response from Gemini", 502);
  }
  return text.trim();
}

function parseJsonResponse(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AppError("Gemini returned invalid JSON", 502);
  }
}

/**
 * Low-level: send contents to Gemini and return raw text.
 */
async function generateText(contents, generationConfig = {}) {
  try {
    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.2,
        ...generationConfig,
      },
    });
    return extractText(result);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(err.message || "Gemini request failed", 502);
  }
}

/**
 * Send user message + extract structured intent/filters.
 */
async function extractIntent({ query, location }) {
  const userPayload = {
    query,
    location: location || null,
  };

  const text = await generateText(
    [
      {
        role: "user",
        parts: [
          { text: INTENT_SYSTEM_PROMPT },
          {
            text: `User request:\n${JSON.stringify(userPayload, null, 2)}`,
          },
        ],
      },
    ],
    { responseMimeType: "application/json" }
  );

  return parseJsonResponse(text);
}

/**
 * Send user request + backend FILTER_DATA, get final UI response JSON.
 */
async function generateFinalResponse({ query, filterData }) {
  const text = await generateText(
    [
      {
        role: "user",
        parts: [
          { text: RESPONSE_SYSTEM_PROMPT },
          {
            text: [
              "USER_REQUEST:",
              query,
              "",
              "FILTER_DATA:",
              JSON.stringify(filterData, null, 2),
            ].join("\n"),
          },
        ],
      },
    ],
    { responseMimeType: "application/json" }
  );

  return parseJsonResponse(text);
}

module.exports = {
  generateText,
  extractIntent,
  generateFinalResponse,
};
