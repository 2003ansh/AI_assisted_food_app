const { ZodError } = require("zod");
const { handleChat } = require("../services/chatService");
const { chatSchema } = require("../schemas/chatSchema");
const { AppError } = require("../utils/errors");

async function chatController(req, res, next) {
  try {
    const parsed = chatSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Validation failed", 400, formatZodIssues(parsed.error));
    }

    const result = await handleChat(parsed.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

function formatZodIssues(error) {
  if (!(error instanceof ZodError)) {
    return [];
  }

  return error.issues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    message: issue.message,
  }));
}

module.exports = { chatController };
