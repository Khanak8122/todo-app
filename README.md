# Todo App

A simple REST API built with Node.js and Express.

## How to run

```bash
npm install
node index.js
```

## API endpoints

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /todos        | Get all todos      |
| POST   | /todos        | Create a todo      |
| PUT    | /todos/:id    | Toggle done status |
| DELETE | /todos/:id    | Delete a todo      |

## Example

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn DevOps"}'
```