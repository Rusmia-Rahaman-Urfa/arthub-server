const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL_FOR_JWT}/api/auth/jwks`)
)
const verifyToken = async (req, res, next) => {
  const tokenData = req.headers.authorization;

  if (!tokenData) {
    return res.status(401).json({ message: 'Unauthorized' });
  };
  const token = tokenData.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  };

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;  // sent payload to req.user
    next();
  }
  catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

// artist verification
const verifyArtist = async (req, res, next) => {
  const user = req.user;
  if (user?.role !== 'artist') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// admin verification
const verifyAdmin = async (req, res, next) => {
  const user = req.user;
  if (user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// buyer verification
const verifyBuyer = async (req, res, next) => {
  const user = req.user;
  if (user?.role !== 'buyer') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const ArtHubDB = client.db('ArtHub');
    const artWorksCollection = ArtHubDB.collection('artworks');
    const paymentsCollection = ArtHubDB.collection('payments');
    const plansCollection = ArtHubDB.collection('plans');
    const purchasesCollection = ArtHubDB.collection('purchases');
    const userCollection = ArtHubDB.collection('user');
    const commentCollection = ArtHubDB.collection('comment');

    // get artist data by artist id for artwork profile data
    app.get('/api/artist/profile',  async (req, res) => {
      const { artistId } = req.query;
      const artistData = await userCollection.findOne({ _id: new ObjectId(artistId) })
      res.json(artistData)
    });
    // get artist data by artist id for artwork profile data
    app.get('/api/artist/profile/artwork', async (req, res) => {
      const { artistId } = req.query;
      const artistData = await artWorksCollection.find({ artistId: artistId }).toArray()
      res.json(artistData)
      });

    //get artwork for feature section 
    app.get('/api/artwork/features', async (req, res) => {
      const result = await artWorksCollection.find().toArray()
      res.json(result)
    })
    // get artworks
    app.get('/api/artwork', async (req, res) => {
      const { search, minPrice, maxPrice, category, sort, page = 1, limit = 12 } = req.query;
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
        ]};
        if (minPrice) query.price = { $gte: Number(minPrice) };
        if (maxPrice) query.price = { $lte: Number(maxPrice) };
        if (category && category !== 'All') {
          query.category = category.toLowerCase();
        }
        let sortOption = {};
        if (sort === 'Latest') {
          sortOption = { createAt: -1 }
        } else if (sort === 'Oldest') {
          sortOption = { createAt: 1 }
        } else if (sort === 'Price Low-High') {
          sortOption = { price: 1 }
        } else if (sort === 'Price High-Low') {
          sortOption = { price: -1 }
        }
        const skip = (Number(page) - 1) * Number(limit);
        const result = await artWorksCollection.find(query).skip(skip).limit(Number(limit)).sort(sortOption).toArray();
        const totalData = await artWorksCollection.countDocuments(query);
        const totalPage = Math.ceil(totalData / Number(limit));
        res.json({ data: result, page: Number(page), totalPage });
      });
      //get artwork by id
      app.get('/api/artwork/:id', async (req, res) => {
        const { id } = req.params;
        const result = await artWorksCollection.findOne({ _id: new ObjectId(id) });
        res.json(result);
        });
  
}finally {
  await client.close();
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
})};