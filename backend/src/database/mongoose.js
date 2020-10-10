import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false);

const URI = process.env.MONGO_URI || 'mongodb://localhost/pokedex-synvia';

// const URI = process.env.MONGO_URI || 'mongodb://localhost/sis-mei';

(() => {
  mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.warn(`Database running: ${URI}`)) // eslint-disable-line
    .catch(err => console.warn(`Error connecting. See error below: `, err)); // eslint-disable-line
})();
