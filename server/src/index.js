const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('../config');
const db = require('../config/db');
const checkAuth = require('./middleware/auth');

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.use('/projects', checkAuth, require('./routes/projects'))
app.use('/comments', require('./routes/comments'))
app.use('/documents', checkAuth, require('./routes/documents'))
app.use('/files', require('./routes/files'))
app.use('/users', checkAuth, require('./routes/users'))
app.use('/signin', require('./routes/auth'))

db.sync()
// db.sync({force: true})
db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  app.listen(process.env.PORT || config.port, () => console.log(`Server start on port ${config.port} ...`))
