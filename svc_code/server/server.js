const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch');
const middleware = require('../middleware/index.js');
const { db, admin } = require('./firebase.js');

const collectionRef = db.collection('questions');

const settings = { ignoreUndefinedProperties: true };
collectionRef.firestore.settings(settings);

const corsOptions = {
  origin: 'https://vlabs-question-bank.web.app', // Your front-end origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};


const app = express();
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(middleware.decodeToken);


const { get_search_and_difficulty } = require('../RouteHandlers/get_multiple.js');
const { get_id } = require('../RouteHandlers/get_single.js');
const { post_questions } = require('../RouteHandlers/post.js');
const { delete_ques } = require('../RouteHandlers/delete.js');
const { update_ques } = require('../RouteHandlers/update.js');
const { get_github } = require('../RouteHandlers/get_github.js');

// Defining Routes
app.get('/api/questions', get_search_and_difficulty);
app.get('/api/questions/:id', get_id);
app.post('/api/questions', post_questions);
app.delete('/api/questions/:id', delete_ques);
app.patch('/api/questions/:id', update_ques);


app.get('/fetch-github-file',get_github);

// New route to get tags from Firestore
app.get('/api/tags', async (req, res) => {
  try {
    const tagsDoc = await db.collection('Tags').doc('Tags').get();
    // console.log(tagsDoc);
    if (!tagsDoc.exists) {
      return res.status(404).send('Tags document not found');
    }

    const tagsData = tagsDoc.data();
    if (!tagsData || !tagsData.tags) {
      return res.status(404).send('No tags found in the document');
    }

    // console.log(tagsData.tags);
    res.json({ tags: tagsData.tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
