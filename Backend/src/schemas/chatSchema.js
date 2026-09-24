const { z } = require("zod");

const chatSchema = z.object({
  query: z.string().trim().min(1),
  location:z.string().trim().min(1),
});

module.exports = { chatSchema };