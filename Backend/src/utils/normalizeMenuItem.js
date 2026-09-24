
function normalizeMenuItem(filtered_data) {
  console.log(filtered_data);
  return filtered_data.map((item) => {
    return {
      name: item.name,
      price: item.price,
      description: item.description,
    };
  });
}

module.exports = { normalizeMenuItem };
