/**
 * Chat orchestration: intent → tools → response.
 */
const { extractIntent, generateFinalResponse } = require("./geminiservices");
const { findRestaurants } = require("../tools/findRestaurants");
const { viewMenu } = require("../tools/viewMenu");
const { compareRestaurants } = require("../tools/compareRestaurants");
const { searchMenu } = require("../tools/searchMenu");
const { findRestaurantsSchema } = require("../schemas/findRestaurantsSchema");
const { viewMenuSchema } = require("../schemas/viewMenuSchema");
const { compareRestaurantsSchema } = require("../schemas/compareRestaurantsSchema");
const { searchMenuSchema } = require("../schemas/searchMenuSchema");
const { AppError } = require("../utils/errors");

function parseToolArgs(schema, data) {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new AppError(
      "I understood your request, but some details were missing or invalid. Try rephrasing with a clear city, dish, or restaurant name.",
      400,
      parsed.error.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      }))
    );
  }

  return parsed.data;
}

async function handleChat(reqData) {
  const { query, location } = reqData;
  const intent = await extractIntent({ query, location });
  console.log("intent", intent);

  if (intent.intent === "unknown") {
    return {
      message:
        "I'm only built for food and restaurant suggestions — finding places to eat, searching menus, viewing a restaurant's menu, or comparing restaurants. Try asking something like \"Find biryani under ₹300 in Baner\".",
      results: [],
      result_count: 0,
      has_results: false,
      limitations: ["out_of_scope"],
    };
  }

  let toolArgs;
  let toolResult;

  switch (intent.intent) {
    case "find_restaurants":
      toolArgs = parseToolArgs(findRestaurantsSchema, intent);
      toolResult = await findRestaurants(toolArgs);
      break;
    case "view_menu":
      toolArgs = parseToolArgs(viewMenuSchema, intent);
      toolResult = await viewMenu(toolArgs);
      break;
    case "compare_restaurants":
      toolArgs = parseToolArgs(compareRestaurantsSchema, intent);
      toolResult = await compareRestaurants(toolArgs);
      break;
    case "search_menu":
      toolArgs = parseToolArgs(searchMenuSchema, intent);
      toolResult = await searchMenu(toolArgs);
      break;
    default:
      return {
        message:
          "I'm only built for food and restaurant suggestions. Please ask about restaurants or food nearby.",
        results: [],
        result_count: 0,
        has_results: false,
        limitations: ["unsupported_intent"],
      };
  }

  const finalResponse = await generateFinalResponse({
    query,
    filterData: { intent: toolArgs, toolResult },
  });
  return finalResponse;
}

module.exports = { handleChat };
