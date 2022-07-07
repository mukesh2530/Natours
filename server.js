//   4) LISTEN
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log('database successfully connected');
  });

// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening from ${port}....`);
});
