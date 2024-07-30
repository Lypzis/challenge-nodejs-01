// uploadFromCsv.js
import { createServer } from 'node:http';
import { parse as csvParse } from 'csv-parse';
import TaskWritableStream from './taskWritableStream.js';

const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/tasks') {
    const parser = csvParse({ columns: true });
    const taskStream = new TaskWritableStream();

    parser.on('error', () => {
      res.writeHead(400).end('Error processing CSV data');
    });

    taskStream.on('error', () => {
      res.writeHead(500).end('Internal Server Error');
    });

    taskStream.on('finish', () => {
      res.writeHead(201).end('Tasks processed successfully');
    });

    req.pipe(parser).pipe(taskStream);
  } else {
    res.writeHead(404).end('Not Found');
  }
});

server.listen(3334);
