# Backend — AI Food Search

Natural-language food search via Gemini + MongoDB (`Resturant_Data`).

## Setup

1. Copy env file and fill values:

```bash
cp .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

## Chat API (SSE stream)

`POST /api/chat` returns **Server-Sent Events**.

### Events

| Event | Payload | When |
|-------|---------|------|
| `meta` | `{ intent, resultsCount, results }` | After intent + Mongo search |
| `token` | `{ text }` | Chunks of the natural-language `message` |
| `result` | `{ recommendations, warnings }` | Structured recommendations |
| `done` | `{ ok: true }` | Stream finished |
| `error` | `{ code, message }` | Failure after stream started |

`results` include backend match flags (`location_match`, `dietary_match`, `preference_match`, `budget_match`) and `price: null` when unavailable (never `0`). Structured `recommendations` only include items with real prices `> 0` and calculated `quantity` / `total_price`.

### Example (curl)

```bash
curl -N -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I want vegetarian momos under ₹100 in Cuttack."}'
```

### Example (Node client)

```js
const res = await fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "I want vegetarian momos under ₹100 in Cuttack.",
  }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  // parse SSE lines: event: … / data: …
}
```

## Health

```bash
curl http://localhost:5000/health
```
