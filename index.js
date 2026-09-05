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
  } finally {
    // Client connection open
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});