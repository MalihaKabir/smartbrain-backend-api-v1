const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'johnDoe',
			entries: 0,
			joined: new Date()
		},
		{
			id: '456',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'sallyDane',
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

// root route:
app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare('dollyJane', '$2a$10$boaEETa9f6Xbjdx.YbdTfuayhsHi.FlSLApDNx2hDfFMvKTox2ECy', function(err, res) {
		// console.log('first guess', res);
	});
	bcrypt.compare('veggies', '$2a$10$boaEETa9f6Xbjdx.YbdTfuayhsHi.FlSLApDNx2hDfFMvKTox2ECy', function(err, res) {
		// console.log('second guess', res);
	});
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		// res.json('success!');
		res.json(database.users[0]);
	}
	res.status(400).json('error logging in');
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	// bcrypt.hash(password, null, null, function(err, hash) {
	// 	console.log(hash);
	// });
	database.users.push({
		id: '789',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

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

app.put('/entries', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (id === user.id) {
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
// root route: res = this is working
// signin --> POST & res = success/fail (you want to secure your password. hence, signin is a POST req.)
// register --> POST & res = the new user object
// profile/:userId(so each user has own home-screen) --> GET & res = user
// rank or image end point --> PUT & res = counted num of rank
