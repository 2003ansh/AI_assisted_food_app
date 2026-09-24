const { z } = require("zod");

/**
 * Zod schema for viewMenu tool arguments.
 * This schema is used to validate the arguments for the viewMenu tool.
 * The arguments are:
 * - location: The location of the restaurant.
 * - restaurant: The restaurant to view the menu for.
 * - food: The food to view the menu for.
 * - budget: The budget for the food.
 * - party_size: The number of people in the party.
 * - filters: The filters to apply to the search.
 * - sort: The sort order to apply to the search.
 * restuant name is mandatory to provide resturant menu.
 */
const viewMenuSchema = z.object({
  
  location: z.object({
    city: z.string().trim().min(1),
    locality: nullableString,
  }),

  restaurant: z.object({
    names: z.array(z.string().trim().min(1)), // it is mandatory to provide at least one restaurant name
  }),

  food: z.object({
    query: z.string().trim().min(1),
    cuisine: nullableString,
    dietary_type: z.enum(["veg", "non_veg", "any"]).default("any"),
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

module.exports = { viewMenuSchema };
