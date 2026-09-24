function escapeRegex(value) { //finds regex special characters and prefixes them with \ to avoid regex injection
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function costNumberExpression() {
  return {
    $convert: {
      input: {
        $trim: {
          input: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: { $ifNull: ["$cost", ""] },
                  find: ",",
                  replacement: "",
                },
              },
              find: "₹",
              replacement: "",
            },
          },
        },
      },
      to: "double",
      onError: null,
      onNull: null,
    },
  };
}

const Restaurant = require("../models/Restaurant");

async function findRestaurants(args) {
  const {
    location: { city, locality } = {},
    restaurant: { names = [] } = {},
    budget = {},
    filters = {},
    sort = {},
    limit = 10,
  } = args;

  const match = {};

  // Intent city (Pune/Bangalore) → DB parent_city
  if (city) {
    match.parent_city = new RegExp(`^${escapeRegex(city)}$`, "i");
  }

  // Intent locality (Baner/Arekere) → DB city
  if (locality) {
    match.city = new RegExp(`^${escapeRegex(locality)}$`, "i");
  }

  const cleanNames = names.filter(Boolean);
  if (cleanNames.length === 1) {
    match.name = new RegExp(escapeRegex(cleanNames[0]), "i");
  } else if (cleanNames.length > 1) {
    match.$or = cleanNames.map((n) => ({
      name: new RegExp(escapeRegex(n), "i"),
    }));
  }

  const pipeline = [
    { $match: match },
    {
      $addFields: {
        costNumber: costNumberExpression(),
        ratingNumber: {
          $convert: {
            input: "$rating",
            to: "double",
            onError: null,
            onNull: null,
          },
        },
      },
    },
  ];

  const numericMatch = {};

  // Restaurant avg cost (DB: cost). Intent budget fields map here.
  if (budget.max_item_price != null) {
    numericMatch.costNumber = {
      ...(numericMatch.costNumber || {}),
      $lte: budget.max_item_price,
    };
  }
  if (budget.min_item_price != null) {
    numericMatch.costNumber = {
      ...(numericMatch.costNumber || {}),
      $gte: budget.min_item_price,
    };
  }
  if (budget.max_total_price != null) {
    numericMatch.costNumber = {
      ...(numericMatch.costNumber || {}),
      $lte: budget.max_total_price,
    };
  }

  if (filters.min_rating != null) {
    numericMatch.ratingNumber = { $gte: filters.min_rating };
  }

  if (Object.keys(numericMatch).length > 0) {
    pipeline.push({ $match: numericMatch });
  }

  const order = sort.order === "asc" ? 1 : -1;
  if (sort.field === "price") {
    pipeline.push({ $sort: { costNumber: order } });
  } else if (sort.field === "rating") {
    pipeline.push({ $sort: { ratingNumber: order } });
  }

  pipeline.push({ $limit: limit });

  // Never return menu payload for this tool
  pipeline.push({
    $project: {
      menu: 0,
      costNumber: 0,
      ratingNumber: 0,
    },
  });

  return Restaurant.aggregate(pipeline);
}

module.exports = {
  findRestaurants,
};
