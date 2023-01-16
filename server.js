const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
// get MongoDB driver connection
const dbo = require('./db/conn');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('./uploads'));

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import routes
const ipfsRoutes = require('./routes/ipfs.route');
const authRoutes = require('./routes/auth.route');
const contentRoutes = require('./routes/content.route');

// create routes
app.use('/api/v1/ipfs', ipfsRoutes);
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/content', contentRoutes);

app.use(express.static(path.join(__dirname, 'client/build')));

dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(port, () => console.log(`Listening on port ${port}`));
});
