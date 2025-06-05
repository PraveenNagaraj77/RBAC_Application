const bcrypt = require('bcryptjs');

const password = 'pandi';

bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});