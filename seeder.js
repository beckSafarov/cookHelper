const fs = require('fs'),
  mongoose = require('mongoose'),
  colors = require('colors'),
  dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models
const userModel = require('./modules/user'),
  foodModel = require('./modules/foods');

//connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);


const food = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/food.json`, 'utf-8')
);


//Import into DB
const importData = async () => {
  try {
    await userModel.create(users);
    await foodModel.create(food);
    await console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await userModel.deleteMany();
    await foodModel.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
