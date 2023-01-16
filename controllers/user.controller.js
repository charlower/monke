const dbo = require('../db/conn');
// Ethers used to perfrom signature authentication
const { ethers } = require('ethers');
// JWT generation and verification
const jwt = require('jsonwebtoken');

exports.setUserName = async (req, res) => {
  const dbConnect = dbo.getDb();
  const walletAddress = req.body.walletAddress;
  const userName = req.body.userName;

  try {
    // Check to see if username updated
    let checkUsernameUpdated = await dbConnect
      .collection('users')
      .findOne({ walletAddress: walletAddress });
    if (checkUsernameUpdated.userName != '') {
      res.json({ status: 'error', message: 'Username already set.' });
      return;
    }

    // Check to see if username is unique.
    let checkUsernameUnique = await dbConnect
      .collection('users')
      .findOne({ userName: userName });
    if (checkUsernameUnique != null) {
      res.json({ status: 'error', message: 'Username already taken.' });
      return;
    }

    // Set username
    await dbConnect.collection('users').updateOne(
      {
        walletAddress: walletAddress,
      },
      {
        $set: { userName: userName },
      }
    );

    res.json({ status: 'success', message: 'Username selected' });
  } catch (err) {
    res.send(err);
  }
};

exports.registerUser = async (req, res) => {
  const dbConnect = dbo.getDb();
  const { walletAddress } = req.body;
  const nonce = Math.floor(Math.random() * 1000000000);

  try {
    await dbConnect.collection('users').insertOne({
      userName: '',
      walletAddress,
      date: Date.now(),
      nonce: nonce,
      species: '',
      content: [],
    });
  } catch (err) {
    res.status(500).send(err);
  }
  res.status(200).json({ msg: 'User registered successfully' });
};

exports.getUser = async (req, res) => {
  const dbConnect = dbo.getDb();
  const { wallet_address } = req.params;

  let user;
  try {
    user = await dbConnect
      .collection('users')
      .findOne({ walletAddress: wallet_address });
  } catch (err) {
    res.status(500).send(err);
  }
  if (user !== null) {
    res.status(200).json({ user: user });
  } else {
    res.json({ msg: 'User not found' });
  }
};

exports.getUserNonce = async (req, res) => {
  const dbConnect = dbo.getDb();
  const { wallet_address } = req.params;

  try {
    const user = await dbConnect
      .collection('users')
      .findOne({ walletAddress: wallet_address });
    res.status(200).json({ nonce: user.nonce });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.signature = async (req, res) => {
  const dbConnect = dbo.getDb();
  const { walletAddress, signedMessage } = req.body;

  try {
    const user = await dbConnect.collection('users').findOne({ walletAddress });
    if (user) {
      const message = `Sign this message to log in to Monke. Your unique code is: ${user.nonce}`;

      // verify signed message
      const decodedAddress = ethers.utils.verifyMessage(message, signedMessage);
      if (decodedAddress.toLowerCase() === walletAddress.toLowerCase()) {
        // update nonce for next login attempt
        try {
          await dbConnect.collection('users').updateOne(
            { walletAddress },
            {
              $set: { nonce: Math.floor(Math.random() * 1000000000) },
            }
          );
          // Set jwt token
          const token = jwt.sign(
            {
              _id: user._id,
              address: user.walletAddress,
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
          );
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: user,
            msg: 'You are now logged in to Monke.',
          });
        } catch (err) {
          res.send(err);
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else if (user === null) {
      res.send('User does not exist');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
