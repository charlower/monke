const dbo = require('../db/conn');

//create a new content
exports.storeFile = async (req, res) => {
  try {
    // getting db connection
    const dbConnect = dbo.getDb();

    //creating document
    const reqData = req.body;
    const contentDocument = {
      title: reqData.title,
      description: reqData.description,
      tags: reqData.tags,
      ipfsHash: reqData.IpfsHash,
      date: Date.now(),
      mintedBy: reqData.walletAddress,
      nftCost: reqData.nftCost,
      comments: [],
    };

    res.json({ status: 'success', message: 'contentDocument' });
  } catch (err) {
    res.send(err);
  }
};

exports.uploadContent = async (req, res) => {
  try {
    // check if duplicate content
    const isDuplicate = req.body.isDuplicate;
    if (isDuplicate) {
      res
        .status(409)
        .json({ status: 'error', message: 'duplicate content detected' });
      return;
    }
    //saving document to collection
    const dbConnect = dbo.getDb();

    const contentDocument = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      ipfsHash: req.body.IpfsHash,
      date: Date.now(),
      mintedBy: req.body.walletAddress,
      nftCost: req.body.nftCost,
      comments: [],
    };

    console.log('content doc', contentDocument);

    await dbConnect.collection('content').insertOne(contentDocument);

    res.json({ success: contentDocument });
  } catch (err) {
    res.send(err);
  }
};
