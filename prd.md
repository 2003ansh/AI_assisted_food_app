# AI Food Agent

## Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Draft
**Product Type:** AI-powered food discovery, meal planning, and ordering assistant
**Primary AI:** Google Gemini
**Future Integration:** Swiggy MCP Server

---

# 1. Product Overview

## 1.1 Product Name

**AI Food Agent**

A conversational AI food assistant that helps users discover restaurants, find dishes, plan meals, compare options, and eventually place food orders through an agentic interface.

Instead of forcing users to manually search restaurants, menus, prices, cuisines, ratings, and dietary options, the AI understands the user's intent and performs the necessary actions through tools.

### Example

User:

> "I have 4 friends coming over tonight. We have ₹1,500. One person is vegetarian and nobody wants anything too spicy. Find us dinner."

The AI should:

1. Understand the requirements.
2. Determine the appropriate number of meals.
3. Search restaurants.
4. Retrieve menus.
5. Filter suitable dishes.
6. Calculate the total cost.
7. Compare options.
8. Recommend the best meal combination.

---

# 2. Problem Statement

Food delivery applications provide powerful search and filtering capabilities, but users still need to manually decide:

* What to eat
* Which restaurant to choose
* Which dishes to order
* How much food is required
* Whether the order fits their budget
* Whether the food satisfies dietary restrictions
* Whether delivery time is acceptable

Traditional search is based primarily on explicit filters.

Users often express their requirements conversationally:

> "Something spicy under ₹400."

> "Give me a healthy dinner for two."

> "I want Chinese food, but not noodles."

> "We have ₹1,000 for five people."

The AI Food Agent converts these natural-language requirements into actions and recommendations.

---

# 3. Product Vision

Build an AI-powered food assistant that acts as a **personal food agent**, rather than another restaurant search interface.

The long-term vision is:

```text
User
  ↓
Natural language request
  ↓
Gemini AI Agent
  ↓
Reasoning
  ↓
Tools / MCP
  ↓
Restaurant + Menu Data
  ↓
Recommendation
  ↓
User Confirmation
  ↓
Order
```

The system should eventually be capable of handling the complete food discovery and ordering workflow conversationally.

---

# 4. Goals

## Primary Goals

### G1 — Natural-language food discovery

Allow users to describe what they want naturally.

Examples:

> "I want something spicy."

> "Find me dinner under ₹500."

> "Show me good North Indian restaurants."

---

### G2 — Intelligent meal planning

Allow users to provide:

* Number of people
* Budget
* Cuisine
* Dietary requirements
* Spice preference
* Meal type

The AI generates an optimized meal plan.

---

### G3 — Agentic restaurant search

Gemini should determine which tools are required to answer the user's request.

Example:

```text
User Request
     ↓
Gemini
     ↓
searchRestaurants()
     ↓
getMenu()
     ↓
filterItems()
     ↓
calculateMeal()
     ↓
Recommendation
```

---

### G4 — Personalized recommendations

The system should learn non-sensitive food preferences such as:

* Favorite cuisines
* Preferred spice level
* Typical budget
* Vegetarian preferences
* Favorite dishes
* Frequently selected restaurants

---

### G5 — MCP-ready architecture

The system must not be tightly coupled to a single food provider.

Initial implementation:

```text
AI Agent
   ↓
FoodProvider Interface
   ↓
Mock/API Provider
```

Future implementation:

```text
AI Agent
   ↓
FoodProvider Interface
   ↓
Swiggy MCP Provider
   ↓
Swiggy MCP Server
```

---

# 5. Non-Goals for MVP

The following are explicitly excluded from the initial MVP:

* Real food ordering
* Real payment processing
* Autonomous purchases
* Delivery tracking
* Restaurant onboarding
* Restaurant management dashboard
* Restaurant inventory management
* Loyalty/rewards system
* Advanced social features

These can be added in later versions.

---

# 6. Target Users

## Primary User

Urban food delivery users who want faster and more intelligent food discovery.

### User characteristics

* Uses food delivery applications
* Comfortable with conversational interfaces
* Has varying food preferences
* Wants recommendations rather than endless browsing

---

# 7. Core Use Cases

## Use Case 1 — Food Search

### User

> "I want something spicy under ₹400."

### System

Gemini extracts:

```json
{
  "spicy": true,
  "maxBudget": 400,
  "people": 1
}
```

The agent searches available restaurants and returns suitable dishes.

---

# 8. Use Case 2 — Restaurant Discovery

### User

> "Find me a good Chinese restaurant nearby."

The agent should consider:

* Cuisine
* Location
* Rating
* Price range
* Availability
* Delivery time

---

# 9. Use Case 3 — Smart Meal Planner

### User

> "Plan dinner for 4 people under ₹1,500."

The agent should:

1. Search restaurants.
2. Retrieve menus.
3. Identify appropriate quantities.
4. Build multiple combinations.
5. Calculate prices.
6. Rank the combinations.
7. Recommend the best option.

---

# 10. Use Case 4 — Dietary Restrictions

### User

> "Find dinner for two. One person is vegetarian."

The agent should ensure that recommended items satisfy the stated restriction.

Additional supported preferences:

* Vegetarian
* Vegan
* Jain
* Egg-free
* Gluten-free

The system should clearly indicate when dietary information is unavailable rather than claiming an item is safe.

---

# 11. Use Case 5 — Conversational Refinement

The AI should maintain context.

Example:

```text
User:
Find me pizza under ₹500.

AI:
Here are three options...

User:
Make it vegetarian.

AI:
Here are the vegetarian options...

User:
Which one is best rated?

AI:
Restaurant B has the highest rating...
```

The user should not need to repeat previous requirements.

---

# 12. Use Case 6 — Surprise Me

User:

> "I don't know what I want. Surprise me."

The agent can ask a small number of questions:

```text
Cuisine?
Budget?
Spice level?
Meal type?
```

Then produce recommendations.

---

# 13. Use Case 7 — Conversational Ordering

Future functionality.

User:

> "I'll take the paneer biryani from the second restaurant."

Agent:

```text
Restaurant: ABC

Item: Paneer Biryani
Quantity: 1
Price: ₹289

Would you like to proceed?
```

The system must require explicit confirmation before any purchase/order action.

---

# 14. Functional Requirements

# 14.1 Authentication

Users should be able to:

* Register
* Login
* Logout
* Reset password
* Login with Google

User profile should contain:

```text
User
 ├── Account
 ├── Preferences
 ├── Conversations
 └── Order history
```

---

# 14.2 AI Chat Interface

The primary interface will be conversational.

Requirements:

* Streaming responses
* Conversation history
* New conversation
* Delete conversation
* Rename conversation
* Markdown support
* Restaurant cards
* Food item cards
* Recommendation cards
* Loading states
* Tool execution indicators

Example:

```text
✓ Understanding request
✓ Searching restaurants
✓ Checking menus
✓ Comparing prices
✓ Preparing recommendations
```

---

# 14.3 Restaurant Search

The system should support:

* Restaurant name
* Cuisine
* Location
* Rating
* Price range
* Delivery time
* Dietary compatibility

---

# 14.4 Menu Search

The system should retrieve:

* Item name
* Description
* Price
* Category
* Vegetarian/non-vegetarian
* Spice information when available
* Availability
* Customization options

---

# 14.5 Meal Planning

Inputs:

```text
People
Budget
Cuisine
Dietary restrictions
Spice preference
Meal type
```

Output:

```text
Restaurant
Items
Quantities
Individual prices
Total price
Estimated price/person
Reason for recommendation
```

---

# 14.6 Recommendation Engine

Every recommendation should contain an explanation.

Example:

```text
Recommended because:

✓ Fits your ₹1,500 budget
✓ Suitable for 5 people
✓ Contains vegetarian options
✓ Medium spice
✓ Highly rated
```

---

# 14.7 User Preferences

Users can configure:

```text
Favorite cuisines
Preferred spice level
Dietary preferences
Budget range
Favorite dishes
```

The AI may use these preferences to personalize recommendations.

---

# 14.8 Conversation Memory

The agent should maintain context within a conversation.

Example:

```text
User:
Find dinner for 3.

AI:
...

User:
Make it cheaper.

AI:
...

User:
What about Chinese?

AI:
...
```

The system should understand that "it" refers to the previous meal recommendation.

---

# 15. AI Agent Architecture

Gemini acts as the reasoning engine.

The agent should have access to tools.

## Initial Tools

```text
searchRestaurants()
getRestaurantDetails()
getMenu()
searchMenuItems()
calculateMeal()
compareRestaurants()
```

Future tools:

```text
getDeliveryEstimate()
getUserPreferences()
updateUserPreferences()
addToCart()
getCart()
placeOrder()
trackOrder()
```

---

# 16. Tool Calling

The AI should not directly access the database.

Instead:

```text
User
 ↓
Gemini
 ↓
Tool decision
 ↓
Backend tool
 ↓
Database / Food Provider
 ↓
Tool result
 ↓
Gemini
 ↓
Final response
```

Example:

```text
User:
Find spicy food under ₹400.

Gemini:
Call searchRestaurants()

Backend:
Returns restaurants.

Gemini:
Call getMenu()

Backend:
Returns menu items.

Gemini:
Filter + rank results.

Gemini:
Return recommendation.
```

---

# 17. MCP Integration

The application should be designed around a provider abstraction.

## FoodProvider

```text
searchRestaurants()
getRestaurantDetails()
getMenu()
searchMenuItems()
getDeliveryEstimate()
placeOrder()
```

### MVP

```text
FoodProvider
     ↓
MockFoodProvider
```

### Future

```text
FoodProvider
     ↓
SwiggyMCPProvider
     ↓
Swiggy MCP Server
```

This allows Swiggy integration without changing the AI agent architecture.

---

# 18. MCP Security

The application must not expose MCP credentials to the frontend.

Architecture:

```text
Browser
   ↓
Backend
   ↓
MCP Client
   ↓
Swiggy MCP Server
```

The frontend communicates only with the application's backend.

---

# 19. Recommendation Ranking

Recommendations should be ranked using factors such as:

```text
Overall Score =
    Budget Fit
  + Preference Match
  + Rating
  + Distance
  + Delivery Time
  + Dietary Compatibility
```

The exact scoring algorithm can evolve.

Gemini should provide reasoning, while deterministic backend logic should handle calculations such as:

* Prices
* Quantities
* Budget validation
* Sorting
* Totals

This prevents the LLM from being the source of truth for numerical calculations.

---

# 20. Database Design

## Users

```text
users
-----
id
name
email
password_hash
created_at
updated_at
```

## Preferences

```text
user_preferences
-----------------
id
user_id
favorite_cuisines
spice_level
dietary_preferences
min_budget
max_budget
favorite_dishes
created_at
updated_at
```

## Conversations

```text
conversations
-------------
id
user_id
title
created_at
updated_at
```

## Messages

```text
messages
--------
id
conversation_id
role
content
tool_calls
created_at
```

## Restaurants

```text
restaurants
-----------
id
provider
provider_restaurant_id
name
rating
cuisine
price_range
location
metadata
created_at
updated_at
```

## Menu Items

```text
menu_items
----------
id
restaurant_id
provider_item_id
name
description
price
category
dietary_tags
metadata
updated_at
```

## Agent Runs

```text
agent_runs
----------
id
conversation_id
user_message_id
status
model
input_tokens
output_tokens
latency
created_at
```

This allows AI usage and performance monitoring.

---

# 21. API Design

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Conversations

```http
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
DELETE /api/conversations/:id
```

## Chat

```http
POST /api/chat
```

Streaming response:

```text
SSE
```

or WebSocket if required.

---

# 22. Food APIs

```http
GET /api/restaurants
GET /api/restaurants/:id
GET /api/restaurants/:id/menu
GET /api/menu/search
```

These endpoints should internally use the `FoodProvider`.

---

# 23. Future MCP APIs

```http
POST /api/cart
GET  /api/cart
POST /api/order/confirm
GET  /api/orders
GET  /api/orders/:id
```

---

# 24. Frontend Requirements

## Main Screens

### 1. Landing Page

Contains:

* Product explanation
* Example prompts
* Start chatting CTA

---

### 2. AI Chat

Primary application screen.

Components:

```text
ChatSidebar
ChatWindow
Message
ToolExecution
RestaurantCard
MenuItemCard
MealPlanCard
RecommendationCard
ChatInput
```

---

### 3. Restaurant Details

Displays:

* Restaurant information
* Rating
* Cuisine
* Menu
* Popular dishes
* AI recommendations

---

### 4. Meal Planner

Optional structured UI:

```text
People:       [ 4 ]

Budget:       [ ₹1500 ]

Cuisine:      [ Chinese ▼ ]

Dietary:      [ Vegetarian ]

Spice:        [ Medium ]

             [Plan My Meal]
```

---

### 5. Preferences

Users can configure food preferences.

---

### 6. History

Shows previous AI conversations.

---

# 25. UX Principles

## Principle 1 — Conversation first

Users should not have to navigate through many filters.

---

## Principle 2 — AI should explain itself

Don't simply say:

> "Try Restaurant A."

Instead:

> "Restaurant A is my top choice because it fits your budget, has highly-rated vegetarian options, and can serve five people within ₹1,500."

---

## Principle 3 — Show agent activity

While the AI is working:

```text
Searching restaurants...
Checking menus...
Comparing options...
```

---

## Principle 4 — Human confirmation

Any action that can result in:

* Purchase
* Order
* Payment
* Account change

must require explicit user confirmation.

---

# 26. Error Handling

The system should gracefully handle:

### No restaurants

```text
I couldn't find restaurants matching all your requirements.

Would you like me to:
• Increase the budget
• Expand the search area
• Remove the cuisine restriction
```

### API failure

```text
Restaurant data is temporarily unavailable.
Please try again.
```

### Gemini failure

Fallback to traditional search functionality where possible.

### Missing menu information

The AI should say:

> "I couldn't verify the spice level for this item."

It must not invent unavailable information.

---

# 27. Performance Requirements

Target:

```text
Initial page load       < 2 seconds
API response            < 500 ms where possible
AI first token          < 2 seconds
Restaurant search       < 2 seconds
```

Use:

* Redis caching
* Database indexes
* Streaming Gemini responses
* Parallel tool calls where possible
* Lazy loading
* CDN for static assets

---

# 28. Security Requirements

* Password hashing
* JWT/session security
* HTTPS
* Rate limiting
* Input validation
* SQL injection protection
* XSS protection
* CSRF protection where applicable
* API authentication
* MCP credentials stored server-side
* Never expose Gemini/MCP secrets to frontend

---

# 29. Observability

Track:

```text
Request latency
Gemini latency
Tool latency
Token usage
Failed tool calls
Gemini errors
Provider errors
Conversation duration
Recommendation acceptance
```

Example:

```text
Agent Run

Total latency: 3.2 sec

Gemini:              1.4 sec
Restaurant search:   0.7 sec
Menu search:         0.8 sec
Ranking:             0.3 sec
```

---

# 30. AI Cost Management

The backend should track Gemini usage.

```text
User
 ↓
Agent Run
 ↓
Input tokens
Output tokens
Total cost
```

Possible limits:

```text
Free user:
50 AI requests/day

Premium:
Higher limit
```

---

# 31. MVP Definition

The MVP should contain:

### Authentication

* [ ] Register
* [ ] Login
* [ ] Logout

### AI

* [ ] Gemini integration
* [ ] Streaming responses
* [ ] Conversation history
* [ ] Tool calling

### Food

* [ ] Restaurant search
* [ ] Menu search
* [ ] Restaurant details
* [ ] Food filtering
* [ ] Budget filtering

### Agent

* [ ] Natural-language food search
* [ ] Smart meal planner
* [ ] Restaurant recommendations
* [ ] Dietary filtering
* [ ] Conversational context

### UI

* [ ] Chat interface
* [ ] Restaurant cards
* [ ] Food cards
* [ ] Meal plan cards
* [ ] Tool execution indicators

### Backend

* [ ] PostgreSQL
* [ ] Redis
* [ ] Authentication
* [ ] Agent orchestration
* [ ] FoodProvider abstraction

---

# 32. Phase 2

After MVP:

* User preference memory
* Personalized recommendations
* Advanced meal planning
* Restaurant comparison
* Delivery time optimization
* Better ranking algorithm
* AI-generated food summaries
* Recommendation feedback

---

# 33. Phase 3 — Swiggy MCP

Integrate the Swiggy MCP server.

Target architecture:

```text
                         ┌──────────────┐
                         │    Gemini    │
                         └──────┬───────┘
                                │
                         AI Agent Layer
                                │
                         ┌──────▼───────┐
                         │ Tool Router  │
                         └──────┬───────┘
                                │
                         FoodProvider
                                │
                    ┌───────────┴───────────┐
                    │                       │
             Mock Provider             MCP Provider
                                            │
                                     Swiggy MCP
                                            │
                                         Swiggy
```

Potential capabilities:

```text
Restaurant discovery
Menu discovery
Food recommendations
Cart management
Order confirmation
Order placement
Order tracking
```

---

# 34. Phase 4 — Autonomous Food Agent

Future vision:

User:

> "Every Friday, order something different for dinner under ₹600."

The agent could:

```text
Friday
  ↓
Understand preference
  ↓
Search restaurants
  ↓
Avoid previous meals
  ↓
Find suitable meal
  ↓
Show recommendation
  ↓
Ask confirmation
  ↓
Place order
```

This should only be implemented with appropriate user authorization and confirmation mechanisms.

---

# 35. Analytics

Track:

### Product metrics

* Daily active users
* Weekly active users
* Conversations/user
* Messages/conversation
* Meal plans generated
* Restaurant searches
* Recommendation clicks
* Restaurant detail views

### AI metrics

* Tool-call success rate
* Average response latency
* Token consumption
* AI error rate
* Recommendation acceptance rate

### Business metrics

Future:

* Orders initiated
* Orders completed
* Average order value
* Repeat orders

---

# 36. Success Criteria

The MVP is successful if users can enter:

> "I need dinner for 3 people under ₹1,000. One is vegetarian."

and receive a useful meal plan without manually navigating multiple search/filter screens.

The agent should:

1. Correctly understand the request.
2. Search restaurants.
3. Retrieve appropriate menu items.
4. Respect dietary requirements.
5. Stay within budget.
6. Explain its recommendation.
7. Maintain conversational context.

---

# 37. Technical Architecture

```text
                         Browser
                            │
                            ▼
                     Next.js Frontend
                            │
                            ▼
                    Node.js / Express
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
           Gemini         Redis       PostgreSQL
              │
              ▼
          AI Agent
              │
              ▼
         Tool Executor
              │
              ▼
        FoodProvider
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
   Mock/API      Swiggy MCP
   Provider        Provider
```

---

# 38. Recommended Repository Structure

```text
ai-food-agent/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── agents/
│   │   ├── tools/
│   │   ├── providers/
│   │   │   ├── FoodProvider.js
│   │   │   ├── MockFoodProvider.js
│   │   │   └── SwiggyMCPProvider.js
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   └── server.js
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docker/
│
└── README.md
```

---

# 39. Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

## Backend

```text
Node.js
Express
TypeScript
```

## Database

```text
PostgreSQL
Redis
```

## AI

```text
Google Gemini API
Gemini Function/Tool Calling
```

## Future AI/Data

```text
Embeddings
Vector Database
RAG
```

## Integration

```text
MCP Client
Swiggy MCP Server
```

## Infrastructure

```text
Docker
AWS
CI/CD
```

---

# 40. Development Milestones

## Milestone 1 — Foundation

* Project setup
* Authentication
* Database
* Basic UI
* Gemini connection

---

## Milestone 2 — Chat

* Streaming
* Conversations
* Message persistence
* Chat UI

---

## Milestone 3 — Food Engine

* Restaurant provider
* Menu provider
* Restaurant cards
* Food cards
* Search

---

## Milestone 4 — Agent

* Gemini tool calling
* Tool executor
* Restaurant search tool
* Menu search tool
* Meal calculation tool
* Recommendation engine

---

## Milestone 5 — Smart Planning

* Budget optimization
* Group meal planning
* Dietary filtering
* Preference handling
* Conversational refinement

---

## Milestone 6 — Production Hardening

* Redis caching
* Rate limiting
* Logging
* Monitoring
* Error handling
* AI usage tracking
* Docker

---

## Milestone 7 — MCP

* MCP client
* Swiggy provider
* Restaurant discovery
* Menu discovery
* Cart integration
* Explicit order confirmation

---

# 41. Example End-to-End Flow

User:

> "I'm hungry. Give me something spicy under ₹400."

### Step 1

Frontend sends message:

```json
{
  "conversationId": "123",
  "message": "I'm hungry. Give me something spicy under ₹400."
}
```

### Step 2

Backend sends request to Gemini.

### Step 3

Gemini decides:

```text
Need restaurant search.
Need menu search.
Need price filtering.
```

### Step 4

Tool:

```text
searchRestaurants()
```

### Step 5

Tool:

```text
searchMenuItems()
```

### Step 6

Backend filters:

```text
price <= ₹400
spice = spicy
```

### Step 7

Gemini ranks the results.

### Step 8

Frontend receives streamed response.

```text
I found three good options...

🌶️ Best Match

Chicken Tikka Roll
₹299

⭐ 4.5
🔥 Spicy
🚚 ~30 min

Why I recommend it:
...
```

---

# 42. Long-Term Product Vision

The final product should evolve from:

```text
AI Chatbot
```

into:

```text
AI Food Assistant
```

and eventually:

```text
AI Food Agent
```

### Evolution

```text
V1
Ask AI
 ↓
Get recommendations

V2
Ask AI
 ↓
AI searches food
 ↓
AI compares options

V3
Ask AI
 ↓
AI searches
 ↓
AI plans meal
 ↓
AI manages cart

V4
Ask AI
 ↓
AI searches
 ↓
AI recommends
 ↓
User confirms
 ↓
AI orders

V5
AI becomes a personalized food agent
```

---

# 43. Product Principle

The central principle of the product is:

> **The user should describe what they want; the AI should figure out how to get there.**

The application should minimize manual filtering and maximize intelligent assistance while keeping important decisions—especially purchases—under explicit user control.
