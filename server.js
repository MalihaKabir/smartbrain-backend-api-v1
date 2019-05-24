const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: '123',
			entries: 0,
			joined: new Date()
		},
		{
			id: '456',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: '456',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
};

// basic/root route:
app.get('/', (req, res) => {
	// res.send('this is working!');
	res.send(database.users);
});

// signin route:
app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	// Comparing two passwords:
	bcrypt.compare('789', '$2a$10$jzGIDKxX1KQL3TMnPA7jduWGMJybDTNgKvRydanlbTcfXD/A2yDtu', function(err, res) {
		console.log('first guess', res);
	});
	bcrypt.compare('veggies', '$2a$10$jzGIDKxX1KQL3TMnPA7jduWGMJybDTNgKvRydanlbTcfXD/A2yDtu', function(err, res) {
		console.log('second guess', res);
	});
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		// Change:
		// res.json('Succed!');
		// To:
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
});

// register/new user route:
app.post('/register', (req, res) => {
	// we want email, name, password from req.body:
	const { name, email, password } = req.body;
	// TO CHECK how HASH work:
	// bcrypt.hash(password, null, null, function(err, hash) {
	// 	console.log(hash);
	// });
	database.users.push({
		id: '789',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

// id of users:
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (id === user.id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(404).json('no such user');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json('no such user');
	}
});

app.listen(3001, () => {
	console.log('app is running on port 3001');
});

// Things To-Do:
// root route('/') --> GET --> res = this is working,
// signin route --> POST --> res = success/fail,
// register --> POST --> return = user,
// profile/:userId --> GET --> ret = user,
// image (end point) --> PUT --> res = count/entries.
