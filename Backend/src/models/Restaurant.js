const mongoose = require("mongoose");

/**
 * Maps to existing Resturant_Data documents.
 * menu stays Mixed — nested category → itemName → { price, veg_or_non_veg }.
 */
const restaurantSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    country: String,
    pincode: mongoose.Schema.Types.Mixed,
    city_link: String,
    restaurant_id: String,
    name: String,
    rating: String,
    menu: mongoose.Schema.Types.Mixed,
    rating_count: String,
    cost: String,
    address: String,
    cuisine: String,
    lic_no: String,
    restaurant_link: String,
  },
  {
    collection: "Resturant_Data",
    strict: false,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
