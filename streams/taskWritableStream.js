import { Writable } from 'node:stream';
import { randomUUID } from 'node:crypto';

import { Database } from '../src/database.js';

const database = new Database();

class TaskWritableStream extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunck, _, callback) {
    const { title, description } = chunck;

    if (title && description) {
      database.insert('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      callback(); // Call the callback to proceed to the next chunk
    } else {
      console.error('Invalid task data:', chunck);
      callback(new Error('Invalid task data')); // Call the callback with an error
    }
  }
}

export default TaskWritableStream;
