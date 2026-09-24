Build the backend for an AI Food Chatbot using **Node.js, Express, MongoDB, Gemini, Zod, and SSE (Server-Sent Events)**.

## 1. Goal

The user will send natural-language food/restaurant queries such as:

* "Find restaurants in Baner"
* "Show restaurants in Baner with rating above 4"
* "Find vegetarian biryani under ₹300 in Baner"
* "Show me the menu of Haka"
* "Compare Haka and Mainland China"
* "Compare vegetarian options between Haka and Mainland China"
* "We are 4 people and want food under ₹1000 in Baner"

The backend should use Gemini to understand the user's request and decide which tool/function(s) should be called.

The backend must then:

1. Filter restaurants using restaurant-level data.
2. Pass the resulting restaurants/restaurant IDs to the appropriate menu operation when required.
3. Filter/process menu data deterministically in Node.js/MongoDB.
4. Return normalized factual results to Gemini.
5. Let Gemini generate the final natural-language response.
6. Stream the response to the frontend using SSE.

---

# 2. High-level architecture

Implement this architecture:

User
↓
Express API
↓
Gemini
↓
Gemini decides tool/function
↓
Tool execution
↓
MongoDB
↓
Normalized factual results
↓
Gemini response generation
↓
SSE
↓
Frontend

The available tools are:

1. `find_restaurants`
2. `search_menu`
3. `view_menu`
4. `compare_restaurants`

Gemini must NOT generate raw MongoDB queries.

Gemini should only provide structured tool arguments.

The Node.js backend is responsible for constructing and executing MongoDB queries.

---

# 3. MongoDB data model

The existing MongoDB data represents restaurants and menus.

Restaurant-level information can include:

```js
{
  restaurant_name,
  photo,
  swiggy_link,
  city,
  locality,
  address,
  cuisine,
  rating,
  menu
}
```

Menu items contain:

```js
{
  item_name,
  price,
  veg_or_nonveg
}
```

Do not assume that the database contains:

* calories
* nutrition
* ingredients
* delivery time
* delivery fee
* distance
* availability
* health score

If these fields do not exist, Gemini must not invent them.

---

# 4. Tool responsibilities

## Tool 1: find_restaurants

Purpose:

Find restaurants using restaurant-level information.

Supported filters should include:

```js
{
  city,
  locality,
  restaurant_name,
  restaurant_names,
  cuisine,
  min_rating,
  limit,
  sort
}
```

Examples:

User:

"Find restaurants in Baner"

→ `find_restaurants`

User:

"Find Chinese restaurants in Baner"

→ `find_restaurants`

User:

"Show restaurants in Baner with rating above 4"

→ `find_restaurants`

The function should return only the relevant restaurant information required by subsequent processing.

Prefer returning:

```js
{
  restaurant_id,
  restaurant_name,
  city,
  locality,
  address,
  cuisine,
  rating,
  photo,
  swiggy_link
}
```

Do not return the entire menu unless required.

---

# 5. Tool 2: search_menu

Purpose:

Search menu items across a set of restaurants.

This tool should generally be called AFTER `find_restaurants` when restaurant-level filtering is required.

Example:

User:

"Find vegetarian biryani under ₹300 in Baner"

Expected flow:

```text
find_restaurants
    ↓
Pune + Baner
    ↓
matching restaurant IDs
    ↓
search_menu
    ↓
biryani + vegetarian + price <= 300
```

The tool should accept:

```js
{
  restaurant_ids,
  item_query,
  cuisine,
  veg_or_nonveg,
  min_price,
  max_price,
  party_size,
  max_total_price,
  limit,
  sort
}
```

Important distinction:

### `max_price`

Means the price of each individual menu item.

Example:

"biryani under ₹300"

```js
{
  max_price: 300
}
```

### `max_total_price`

Means the total budget for the order/group.

Example:

"Food for 4 people under ₹1000"

```js
{
  party_size: 4,
  max_total_price: 1000
}
```

Do not confuse these two.

---

# 6. Tool 3: view_menu

Purpose:

Return the menu of a specific restaurant.

Examples:

"Show me Haka's menu"

"What does Haka have?"

"Show vegetarian items from Haka"

The function should accept:

```js
{
  restaurant_id,
  restaurant_name,
  veg_or_nonveg,
  item_query,
  min_price,
  max_price,
  limit,
  sort
}
```

If restaurant-level filtering identifies the restaurant first, use its MongoDB `_id` rather than relying on the name for subsequent queries.

Return normalized menu data.

---

# 7. Tool 4: compare_restaurants

Purpose:

Compare two or more restaurants.

Examples:

"Compare Haka and Mainland China"

"Compare Haka and Mainland China for vegetarian food"

"Compare their biryani options under ₹300"

The tool should accept:

```js
{
  restaurant_ids,
  restaurant_names,
  item_query,
  veg_or_nonveg,
  min_price,
  max_price
}
```

The backend should fetch/process the relevant data and return structured comparison data.

Do NOT ask Gemini to decide the winner.

Gemini can summarize factual differences, but the backend must provide the underlying data.

---

# 8. Gemini tool selection

Configure Gemini with the four tools/functions.

Each tool must have a detailed description explaining:

* what the tool does
* when it should be called
* when it should NOT be called
* the parameters it accepts
* examples

Gemini should be allowed to call more than one tool when necessary.

For example:

```text
User:
"Find vegetarian biryani under ₹300 in Baner"

Gemini
   ↓
find_restaurants({
    city: "Pune",
    locality: "Baner"
})
   ↓
Backend
   ↓
restaurant IDs
   ↓
Gemini
   ↓
search_menu({
    restaurant_ids: [...],
    item_query: "biryani",
    veg_or_nonveg: "veg",
    max_price: 300
})
```

The backend should support this multi-step tool flow.

---

# 9. Do NOT let Gemini create MongoDB queries

Never allow Gemini to return:

```js
{
  "$match": {
    ...
  }
}
```

or:

```js
{
  "menu.price": {
    "$lte": 300
  }
}
```

Instead Gemini should return semantic arguments:

```js
{
  item_query: "biryani",
  veg_or_nonveg: "veg",
  max_price: 300
}
```

Node.js converts those arguments into MongoDB filters.

This is required for security, validation, and predictable database behavior.

---

# 10. Zod validation

Use Zod to validate every tool's arguments before executing the function.

Create schemas such as:

```js
findRestaurantsSchema
searchMenuSchema
viewMenuSchema
compareRestaurantsSchema
```

Example:

```js
const searchMenuSchema = z.object({
  restaurant_ids: z.array(z.string()).optional(),
  item_query: z.string().nullable().optional(),
  cuisine: z.string().nullable().optional(),
  veg_or_nonveg: z.enum(["veg", "non_veg", "any"]).default("any"),
  min_price: z.number().nullable().optional(),
  max_price: z.number().nullable().optional(),
  party_size: z.number().int().positive().default(1),
  max_total_price: z.number().nullable().optional(),
  limit: z.number().int().min(1).max(50).default(20),
  sort: z.enum(["relevance", "price", "rating"]).default("relevance")
});
```

Adapt the schema to the existing project conventions.

Invalid Gemini arguments must never reach MongoDB.

---

# 11. Price handling

The database may contain bad/missing prices.

For example:

```js
{
  item_name: "Chicken Fried Rice",
  price: 0
}
```

A price of `0` should NOT automatically be treated as a free item.

Unless the application explicitly considers ₹0 valid, treat:

```text
0
null
undefined
empty string
non-numeric value
```

as an unavailable/invalid price.

Do not calculate:

```text
4 × ₹0 = ₹0
```

Do not claim that an item satisfies a budget when its price is unavailable.

Normalize invalid prices to:

```js
price: null
```

and optionally include:

```js
price_available: false
```

before passing results to Gemini.

---

# 12. Healthy food handling

The database does not contain reliable nutritional information.

Therefore:

```text
"healthy"
```

must be treated as a user preference, NOT a factual filter.

Do NOT convert:

```text
healthy
```

into:

```text
veg
```

For example:

"Find healthy food"

should NOT become:

```js
veg_or_nonveg: "veg"
```

If nutritional information is unavailable, the final Gemini response should clearly state that the system cannot verify whether an item is actually healthy.

---

# 13. Deterministic processing

All objective filtering should happen in Node.js/MongoDB.

For example:

User:

"Find veg biryani under ₹300"

Gemini:

```js
{
  item_query: "biryani",
  veg_or_nonveg: "veg",
  max_price: 300
}
```

Backend:

```text
item name contains "biryani"
AND
veg_or_nonveg = "Veg"
AND
price <= 300
```

MongoDB should perform this filtering.

Do not send hundreds of raw menu items to Gemini and ask Gemini to filter them.

Gemini should receive already-filtered factual data.

---

# 14. Normalized result format

All menu search operations should return a common structure:

```json
{
  "results": [
    {
      "restaurant": "Filmy Food",
      "item": "Biryani Raita",
      "price": 20,
      "veg_or_non_veg": "Veg"
    },
    {
      "restaurant": "SHANTI RESTAURANT",
      "item": "Veg Biryani (half)",
      "price": 70,
      "veg_or_non_veg": "Veg"
    },
    {
      "restaurant": "AMBIKA CATERING",
      "item": "Veg Biryani",
      "price": 90,
      "veg_or_non_veg": "Veg"
    }
  ],
  "count": 3,
  "filters_applied": {
    "item_query": "biryani",
    "veg_or_nonveg": "veg",
    "max_price": 300
  }
}
```

Keep this result compact.

Do not pass unnecessary MongoDB fields to Gemini.

---

# 15. Final Gemini response

After tool execution, pass the factual tool results back to Gemini.

Gemini's second responsibility is ONLY to generate the natural-language response.

Example:

```text
MongoDB/tool result:

3 matching items
```

Gemini can respond:

```text
I found 3 vegetarian biryani options:

1. Filmy Food — Biryani Raita — ₹20
2. SHANTI RESTAURANT — Veg Biryani (half) — ₹70
3. AMBIKA CATERING — Veg Biryani — ₹90
```

Gemini must not invent:

* ratings
* ingredients
* nutrition
* calories
* delivery time
* distance
* availability
* discounts
* restaurant information not returned by the backend

---

# 16. SSE streaming

Expose an endpoint such as:

```text
POST /api/chat
```

The endpoint should stream events to the frontend.

Use:

```text
event: meta
data: {...}

event: token
data: {"text":"..."}

event: result
data: {...}

event: done
data: {"ok":true}
```

Example:

```text
event: meta
data: {
  "status": "processing"
}

event: token
data: {
  "text": "I found "
}

event: token
data: {
  "text": "3 vegetarian biryani options..."
}

event: result
data: {
  "results": [...]
}

event: done
data: {
  "ok": true
}
```

Do NOT duplicate the complete recommendation data in both `result` and `done`.

`result` should contain structured data.

`done` should simply indicate completion.

---

# 17. Suggested project structure

Use a clean separation of concerns:

```text
src/
├── config/
│   ├── db.js
│   └── gemini.js
│
├── models/
│   └── Restaurant.js
│
├── schemas/
│   ├── findRestaurants.schema.js
│   ├── searchMenu.schema.js
│   ├── viewMenu.schema.js
│   └── compareRestaurants.schema.js
│
├── tools/
│   ├── findRestaurants.tool.js
│   ├── searchMenu.tool.js
│   ├── viewMenu.tool.js
│   └── compareRestaurants.tool.js
│
├── services/
│   ├── restaurant.service.js
│   ├── menu.service.js
│   ├── comparison.service.js
│   └── chat.service.js
│
├── repositories/
│   └── restaurant.repository.js
│
├── gemini/
│   ├── toolDefinitions.js
│   ├── intent.js
│   └── response.js
│
├── routes/
│   └── chat.routes.js
│
└── app.js
```

If the existing project already has a structure, follow the existing conventions rather than unnecessarily restructuring the whole project.

---

# 18. Important implementation principle

Separate these three responsibilities:

### Gemini

```text
Understand user language
↓
Select tool
↓
Generate tool arguments
↓
Generate final natural-language response
```

### Node.js

```text
Validate arguments
↓
Build safe MongoDB query
↓
Execute tools
↓
Perform calculations
↓
Normalize results
```

### MongoDB

```text
Store data
↓
Filter/query data
```

Never reverse these responsibilities.

---

# 19. Example complete flow

For:

```text
"We are 4 people and want vegetarian food under ₹1000 in Baner."
```

Gemini should determine:

```text
find_restaurants
```

with:

```json
{
  "city": "Pune",
  "locality": "Baner"
}
```

Backend finds matching restaurants.

Then Gemini/backend should use:

```text
search_menu
```

with:

```json
{
  "restaurant_ids": ["..."],
  "item_query": null,
  "veg_or_nonveg": "veg",
  "max_price": null,
  "party_size": 4,
  "max_total_price": 1000
}
```

The backend should then determine whether available item combinations can satisfy the group budget.

Do not ask Gemini to perform the database filtering.

---

# 20. Another example

User:

```text
"Show me vegetarian biryani under ₹300 in Baner."
```

Expected:

```text
find_restaurants
        ↓
city=Pune
locality=Baner
        ↓
restaurant IDs
        ↓
search_menu
        ↓
item_query=biryani
veg_or_nonveg=veg
max_price=300
        ↓
normalized results
        ↓
Gemini response
```

---

# 21. Another example

User:

```text
"What does Haka have?"
```

Expected:

```text
find_restaurants
        ↓
restaurant_name=Haka
        ↓
restaurant ID
        ↓
view_menu
        ↓
menu
        ↓
Gemini response
```

---

# 22. Another example

User:

```text
"Compare Haka and Mainland China for vegetarian dishes."
```

Expected:

```text
find_restaurants
        ↓
Haka + Mainland China
        ↓
restaurant IDs
        ↓
compare_restaurants
        ↓
veg menu comparison
        ↓
Gemini response
```

---

# 23. Do not over-engineer initially

Implement the following first:

1. MongoDB connection
2. Restaurant model/repository
3. `find_restaurants`
4. `search_menu`
5. `view_menu`
6. `compare_restaurants`
7. Zod schemas
8. Gemini tool definitions
9. Gemini tool-calling loop
10. Final Gemini response generation
11. SSE `/api/chat` endpoint
12. Error handling and logging

Keep the implementation modular so additional tools can be added later.

Do not add unnecessary agents, vector databases, RAG, embeddings, or complex orchestration at this stage.

The current data is structured MongoDB restaurant/menu data, so deterministic MongoDB filtering should be the primary retrieval mechanism.

---

# 24. Deliverables

Build the implementation in the existing backend repository.

Provide:

* Gemini configuration
* Tool definitions
* Zod schemas
* MongoDB repository/query functions
* Four tool implementations
* Gemini tool-calling/orchestration loop
* Final response generation
* SSE endpoint
* Error handling
* Environment variable configuration
* Example API request
* Example SSE response
* Example test cases for each tool
* README/documentation explaining the architecture

Before changing existing code, inspect the repository and reuse existing MongoDB models, configuration, routes, middleware, and conventions where possible.

Do not create duplicate database connections or duplicate service layers if equivalent functionality already exists.
