const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');
const app = express();

app.use(cors());
app.use(express.static('public/uploads'));

app.use(morgan('dev'));
app.use(express.json());

//app.use('/api/user', require('./routes/user'));
const PORT = process.env.PORT || 4000;


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