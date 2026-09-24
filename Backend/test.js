require("dotenv").config();
const fs = require("fs");
const { connectDB } = require("./src/config/db");
const Restaurant = require("./src/models/Restaurant");

async function main() {
  await connectDB();
  const count = await Restaurant.countDocuments({});
  const restaurants = await Restaurant.find({
    city: "Cuttack"
  });
  let restaurant;
  let data=[];
  for ( restaurant = 0; restaurant < restaurants.length; restaurant++) {
    console.log(restaurants[restaurant].name, "\n");
    const menu = restaurants[restaurant].menu;
    Object.keys(menu).forEach(key => {
        const item = menu[key];
        Object.keys(item).forEach(subKey => {
            const subItem = item[subKey];
            let item_name = subKey.split(" ").join(",");
            if (item_name.includes("Biryani") && subItem.veg_or_non_veg === "Veg") {
            data.push({
                restaurant: restaurants[restaurant].name,
                item: subKey,
                price: parseFloat(subItem.price),
                veg_or_non_veg: subItem.veg_or_non_veg
            })
        }
        })
    })
    console.log("\n");
  }
  data.sort((a, b) => a.price - b.price);
  console.log("Restaurants:", restaurants.length, "\n");
//   console.log(data);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

