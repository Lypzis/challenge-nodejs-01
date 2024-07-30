import { randomUUID } from 'node:crypto';

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler(_, res) {
      const users = database.select('tasks');

      return res.writeHead(200).end(JSON.stringify(users));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler(req, res) {
      const { title, description } = req?.body;

      if (title && description) {
        database.insert('tasks', {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        return res.writeHead(201).end();
      }

      return res.writeHead(401).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params;
      const title = req.body?.title;
      const description = req.body?.description;

      if (!title || !description)
        return res
          .writeHead(400)
          .end('Missing required fields: title and description are required');

      const dbResponse = database.update('tasks', {
        id,
        title,
        description,
        updated_at: new Date(),
      });

      return dbResponse
        ? res.writeHead(204).end()
        : res.writeHead(404).end('Task not found');
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler(req, res) {
      const { id } = req.params;

      const dbResponse = database.update('tasks', {
        id,
        completed_at: new Date(),
      });

      return dbResponse
        ? res.writeHead(204).end()
        : res.writeHead(404).end('Task not found');
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params;

      const dbResponse = database.delete('tasks', id);

      return dbResponse
        ? res.writeHead(204).end()
        : res.writeHead(404).end('Task not found');
    },
  },
];
