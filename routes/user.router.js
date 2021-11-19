const express = require('express');
const userModel = require('../services/models/user.model');
const router = express.Router();
const schema = require('../schemas/user.json');
const update_user_info_schema = require('../schemas/update_user_info.json');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const validate = require('../middlewares/validate');
const config = require('../config/default.json');
const randomstring = require('randomstring');
const mailer = require('../utils/mailer');
const { json } = require('body-parser');
const roleModel = require('../services/models/role.model');
const productModel = require('../services/models/product.model');
require('moment/locale/vi');

const formatJson = (user, watchlist,auctionList) => {
    return {
        id: user.id,
        Email: user.Email,
        Adress: user.Adress,
        Birthday: user.Birthday,
        Password: user.Password,
        Firstname: user.Firstname,
        DateCreated: user.DateCreated,
        DateUpdated: user.DateUpdated,
        RateGood: user.RateGood,
        RateBad: user.RateBad,
        Scope: user.Scope,
        Isdeleted: user.Isdeleted,
        RefreshToken: user.RefreshToken,
        Lastname: user.Lastname,
        watchlist: watchlist,
        auctionList:auctionList
    };
};

const formatJsonWatchList = (product) => {
    return {
        id: product.IdProduct,
        IdUserBuyer: product.IdUserBuyer,
        IdUserSeller: product.IdUserSeller,
        Name: product.Name,
        NowPrice: product.NowPrice,
        Description: product.Description,
        DateEnd:product.DateEnd
    };
};
const formatJsonAuctionList = (product) => {
    return {
        id: product.IdProduct,
        IdCategory: product.IdCategory,
        IdUserBuyer: product.IdUserBuyer,
        IdUserSeller: product.IdUserSeller,
        Name: product.Name,
        NowPrice: product.NowPrice,
        Description: product.Description,
        DateEnd:product.DateEnd
    };
};

router.get('/', async function (req, res) {
    const rows = await userModel.findAll();
    res.json(rows);
})

var watchList_found = [];
var auctionList_found = [];
var user_found;

router.get('/info/:id', async function (req, res) {
    const userId = req.params.id;
    const data = await userModel.findById(userId);
    const prodlist = await productModel.findAllOnWatchList();
    const auctionList = await productModel.findAllOnAuction();

    watchList_found = [];
    prodlist.map((i) => {
        if (i.IdUser == userId) {
            watchList_found.push(formatJsonWatchList(i));
        }
    });
    auctionList_found = [];
    auctionList.map((a) => {

        if (a.IdUser == userId) {
            auctionList_found.push(formatJsonAuctionList(a));
        }
    });
    user_found = formatJson(data, watchList_found,auctionList_found)
    if (data === 0) {
        return res.status(500).json("was row ecfect").end();
    }
    res.status(202).json(user_found);
});

router.put('/update-password/:id', async function (req, res) {
    const userId = req.params.id;
    const newPassword = req.body.NewPassword;
    const oldPassword = req.body.OldPassword;

    if (!userId || !newPassword || !oldPassword) {
        return res.status(400).json({ message: "400 Bad request" }).end();
    }

    var user = await userModel.findById(userId);
    if (!await bcrypt.compare(oldPassword, user.Password)) {
        return res.status(400).json({ message: "Password's not correct" }).end();
    }

    var newHashPassword = bcrypt.hashSync(newPassword, config.authentication.saltRounds);
    const rows = await userModel.updatePassword(userId, newHashPassword);
    if (!rows) {
        return res.status(404).json({ message: "Something went wrong" }).end();
    }
    res.status(200).json({ "message": "Password update successfully!" }).end();
});

router.put('/info/update', validate(update_user_info_schema), async function (req, res) {
    const user = await userModel.findById(req.body.Id);
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    const userData = {
        Id: req.body.Id,
        Email: req.body.Email,
        Address: req.body.Address,
        Birthday: moment(req.body.Birthday, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
    }
    await userModel.update(userData);
    return res.json({ message: "User info updated" }).status(200).end();
});

router.post('/request/upto-seller/:id', async function (req, res) {
    const id = req.params.id;

    const raw = await userModel.requestUptoSeller(id);

    if (raw === 0) {
        return res.status(400).json({ message: "gửi yêu cầu thất bại" });
    }

    return res.status(202).json({ raw });
});

router.get('/profile/:userId', async function (req, res) {
    const user = await userModel.findById(req.params.userId);
    const product = productModel.findAllOnWatchList(req.params.userId);
    return res.json(user).status(200).end();
});
// router.use('/auth/facebook', require('./social/facebook'));

router.get('/myWatch/:id', async function (req, res) {
    const listProd = await productModel.findAllOnWatchList(req.params.id);

    return res.json(listProd).status(200).end();
})

module.exports = router;