const express = require('express');
const cors = require('cors');
// const admin = require('firebase-admin');

const {db}=require('./firebase.js')

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies


const {get_search_and_difficulty}=require('./Route_Handlers/get_multiple.js')
// Route handlers begin
// console.log(get_search_and_difficulty);

const {get_id}=require('./Route_Handlers/get_single.js')

const {post_questions}=require('./Route_Handlers/post.js')


const {delete_ques}=require('./Route_Handlers/delete.js');

const {update_ques}=require('./Route_Handlers/update.js');

// Route handlers end


// Defining Routes
app.get('/api/questions',get_search_and_difficulty);
// GET route to retrieve a single question by ID
app.get('/api/questions/:id', get_id);
// New POST route to create multiple questions
app.post('/api/questions',post_questions);
// DELETE route to delete a question
app.delete('/api/questions/:id',delete_ques);

app.patch('/api/questions/:id',update_ques);


// Creating Server
const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });