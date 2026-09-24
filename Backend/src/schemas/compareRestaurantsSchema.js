const { z } = require("zod");

/**
 * Zod schema for compareRestaurants tool arguments.
 */
const nullableString = z.string().trim().nullable().default(null);
const compareRestaurantsSchema = z.object({
  
  location: z.object({
    city: z.string().trim().min(1),
    locality: nullableString,
  }),

  restaurant: z.object({
    names: z.array(z.string().trim().min(1)), // it is mandatory to provide at least two restaurant names
  }),

  budget: z
    .object({
      max_item_price: z.number().nonnegative().nullable().default(null),
      min_item_price: z.number().nonnegative().nullable().default(null),
      max_total_price: z.number().nonnegative().nullable().default(null),
    })
    .default({}),

  party_size: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.number().int().positive().default(1)
  ),

  filters: z
    .object({
      min_rating: z.number().min(0).max(5).nullable().default(null),
    })
    .default({}),

  sort: z
    .object({
      field: z.enum(["relevance", "price", "rating"]).default("relevance"),
      order: z.enum(["asc", "desc"]).default("desc"),
    })
    .default({}),

  limit: z.number().int().positive().max(50).default(10),
});

module.exports = { compareRestaurantsSchema };
