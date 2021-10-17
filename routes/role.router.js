const express=require('express');
const router = express.Router();
const roleModel=require('../services/models/role.model');
const userModel=require('../services/models/user.model');

router.put('/update/:userId', async function(req,res){
    const newRoleId = req.query.newRoleId;
    const userId = req.params.userId;

    if (!newRoleId || !userId) {
        return res.json({message: "404 Bad request"}).status(400).end();
    }

    const checkingRole = await roleModel.findById(newRoleId);
    if (checkingRole < 1) {
        return res.json({message: "404 Role not found"}).status(404).end()
    }

    roleModel.updateUserRole(userId, newRoleId);
    return res.json({message: "Updated user role"}).status(200).end();
})

router.put('/seller-to-bidder/:userId', async function(req,res){
    const userId = req.params.userId;

    if (!userId) {
        return res.json({message: "404 Bad request"}).status(400).end();
    }

    roleModel.updateSellerToBidder(userId);
    return res.json({message: "Updated user role"}).status(200).end();
})

module.exports = router;