let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const express = require('express');
const app = express();

app.use(express.json());

const morgan = require('morgan');

morgan.token('bodyData', (request, response) => {
return JSON.stringify(request.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :bodyData'
  )
);

app.get('/api/persons', (request, response) => {
  response.json(data);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  const name = data.find((person) => person.name === request.body.name);
  if (name) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: request.body.name,
    number: request.body.number,
  };
  data = [...data, person];
  data.sort((a, b) => a.id - b.id);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
