const { z } = require("zod");

/**
 * Zod schema for findRestaurants tool arguments.
 * This schema is used to validate the arguments for the findRestaurants tool.
 * The arguments are:
 * - location: The location of the restaurant.
 * - restaurant: The restaurant to search for.
 * - budget: The budget for the restaurant.
 * - party_size: The number of people in the party.
 * - filters: The filters to apply to the search.
 * - sort: The sort order to apply to the search.
 * - limit: The number of results to return.
 * it is used for finding restaurants in a given location and budget.
 * 
 * Expected output:
 * {
 *   "location": {
 *     "city": "New York",
 *     "locality": "New York"
 *   },
 *   "restaurant": {
 *     "names": ["Restaurant 1", "Restaurant 2"]
 *   },
 *   "budget": {
 *     "max_item_price": 100,
 *     "min_item_price": 50,
 *     "max_total_price": 200
 *   },
 * }
 *   "party_size": 2,
 *   "filters": {
 *     "min_rating": 4.5
 *   },
 *   "sort": {
 *     "field": "relevance",
 *     "order": "desc"
 *   },
 *   "limit": 10
 * }
 */
nullableString = z.string().trim().nullable().default(null);
const findRestaurantsSchema = z.object({
  // TODO: define fields
  location: z.object({
    city: z.string().trim().min(1),
    locality: nullableString,
  }),

  restaurant: z.object({
    names: z.array(nullableString).default([]),
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

module.exports = { findRestaurantsSchema };
