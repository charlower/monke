const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

exports.getCards = async (req, res) => {
  const { skip, search_query } = req.params;
  const dbConnect = dbo.getDb();

  const agg = [
    {
      $lookup: {
        from: 'users',
        localField: 'mintedBy',
        foreignField: 'walletAddress',
        as: 'userDocs',
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        date: 1,
        tags: 1,
        ipfsHash: 1,
        mintedBy: 1,
        nftCost: 1,
        comments: 1,
        userName: '$userDocs.userName',
      },
    },
  ];

  const isSearch = search_query !== "''";

  try {
    const coll = dbConnect.collection('content');

    // Add search query to start of array
    if (isSearch) {
      agg.unshift({
        $search: {
          text: {
            query: search_query,
            path: {
              wildcard: '*',
            },
          },
        },
      });
    }

    const cards = await coll
      .aggregate(agg)
      .sort({ date: -1 })
      .skip(Number(skip))
      .limit(12)
      .toArray();

    setTimeout(() => res.status(200).send(cards), isSearch ? 0 : 500);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getOneCard = async (req, res) => {
  const { id } = req.params;
  const uId = ObjectId(id);
  const dbConnect = dbo.getDb();

  const agg = [
    {
      $match: {
        _id: uId,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'mintedBy',
        foreignField: 'walletAddress',
        as: 'userDocs',
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        date: 1,
        tags: 1,
        ipfsHash: 1,
        mintedBy: 1,
        nftCost: 1,
        comments: 1,
        userName: '$userDocs.userName',
      },
    },
  ];

  try {
    const coll = await dbConnect.collection('content');
    const card = await coll.aggregate(agg).toArray();
    res.status(200).send(card[0]);
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.comment = async (req, res) => {
  const { comment, commentFrom, commenterName, nftId } = req.body;
  try {
    const dbConnect = dbo.getDb();
    const coll = await dbConnect.collection('content');
    // create a filter for a piece of content to update
    const filter = { _id: ObjectId(nftId) };

    // push comment into array
    const updateDoc = {
      $push: {
        comments: { comment, commentFrom, commenterName, postDate: Date.now() },
      },
    };

    await coll.updateOne(filter, updateDoc);

    const options = {
      projection: { comments: 1 },
    };

    const updatedComments = await coll.findOne(filter, options);

    res.send(updatedComments);
  } catch (err) {
    res.send(err);
  }
};

exports.deleteContent = async (req, res) => {
  const { id } = req.body;
  const uId = ObjectId(id);
  const dbConnect = dbo.getDb();
  try {
    const coll = await dbConnect.collection('content');
    const query = { _id: uId };

    const result = await coll.deleteOne(query);

    if (result.deletedCount === 1) {
      console.log('Successfully deleted one document.');
    } else {
      console.log('No documents matched the query. Deleted 0 documents.');
    }
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};
