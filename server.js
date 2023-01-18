const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const enforce = require('express-sslify');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

// get MongoDB driver connection
const dbo = require('./db/conn');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('./uploads'));
if (env === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

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

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(port, () => console.log(`Listening on port ${port}`));
});
