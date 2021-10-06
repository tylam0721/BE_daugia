const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const auth = require('./middlewares/auth');

require('express-async-errors');

const app = express();

app.use(cors());
app.use(express.static('public/uploads'));

app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api/auth', require('./routes/auth.route'));

app.use('/api/user',require('./routes/user.router'));

app.use('/api/category',require('./routes/category.route'));

app.use('/api/login', auth, require('./routes/login.route'));

app.use('/user',require('./routes/user.router'));


app.use(function(req, res, next) {
    res.status(404).json({
        message: 'endpoint not found'
    });
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        message: 'server failure'
    });
});

app.listen(PORT, function() {
    console.log(` at http://localhost:${PORT}`);
});