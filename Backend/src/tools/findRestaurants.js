
const restaurantService = require("../services/restaurantService");
const { normalizeMenuItem } = require("../utils/normalizeMenuItem");

async function findRestaurants(args) {
  const filtered_data=await restaurantService.findRestaurants(args);
  return normalizeMenuItem(filtered_data);
}

module.exports = { findRestaurants };
