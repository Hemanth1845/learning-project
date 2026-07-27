require('dotenv').config();
const mongoose = require('mongoose');
const runSeeder = require('./config/seeder');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_prep';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for manual seeding...');
    await runSeeder();
    console.log('Manual seeding finished successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
