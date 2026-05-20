import { test, expect, request } from '@playwright/test';

test.describe('Todo API', () => {

  test('GET /todos returns an empty array initially', async ({ request }) => {
    const response = await request.get('/todos');

    // Status should be 200 OK
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Should be an array
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /todos creates a new todo', async ({ request }) => {
    const response = await request.post('/todos', {
      data: { title: 'Learn CI/CD' },
    });

    // 201 Created
    expect(response.status()).toBe(201);

    const todo = await response.json();

    // Should have these fields
    expect(todo).toHaveProperty('id');
    expect(todo.title).toBe('Learn CI/CD');
    expect(todo.done).toBe(false);
  });

  test('POST /todos returns 400 if title is missing', async ({ request }) => {
    const response = await request.post('/todos', {
      data: {},
    });

    // Should reject with 400 Bad Request
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('PUT /todos/:id toggles done status', async ({ request }) => {
    // First create a todo
    const created = await request.post('/todos', {
      data: { title: 'Toggle me' },
    });
    const todo = await created.json();

    // Now toggle it
    const toggled = await request.put(`/todos/${todo.id}`);
    expect(toggled.status()).toBe(200);

    const updatedTodo = await toggled.json();

    // done should now be true
    expect(updatedTodo.done).toBe(true);
  });

  test('PUT /todos/:id returns 404 for non-existent id', async ({ request }) => {
    const response = await request.put('/todos/99999');
    expect(response.status()).toBe(404);
  });

  test('DELETE /todos/:id removes a todo', async ({ request }) => {
    // Create one to delete
    const created = await request.post('/todos', {
      data: { title: 'Delete me' },
    });
    const todo = await created.json();

    // Delete it
    const deleted = await request.delete(`/todos/${todo.id}`);
    expect(deleted.status()).toBe(204);

    // Verify it's gone — GET all and check id not present
    const all = await request.get('/todos');
    const todos = await all.json();
    const found = todos.find((t: any) => t.id === todo.id);
    expect(found).toBeUndefined();
  });

  test('DELETE /todos/:id returns 404 for non-existent id', async ({ request }) => {
    const response = await request.delete('/todos/99999');
    expect(response.status()).toBe(404);
  });

});