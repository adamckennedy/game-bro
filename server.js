const express = require('express');
//const routes = require('./routes');
const sequelize = require('./config/connection');
const routes = require('./controllers/');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(routes);

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, function() {
        console.log('App listening on PORT ' + PORT);
    });
});