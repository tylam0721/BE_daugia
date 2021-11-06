const express = require("express");

const userModel = require("../services/models/user.model");
const router = express.Router();

router.get("/bidder", async (req, res) => {
  const data = await userModel.findByBidder();
  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ data });
});

router.get("/seller", async (req, res) => {
  const data = await userModel.findBySeller();
  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ data });
});

router.post("/upto", async (req, res) => {
  const data = req.body;

  const upto = {
    DateUpdated: new Date(),
    Scope: 15,
  };

  const raw = await userModel.upto(data.id, upto);
  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  await userModel.reserReques(data.id);

  return res.status(202).json({
    message: "Upto bidder to seller successfully",
  });
});

router.post("/downto", async (req, res) => {
  const data = req.body;

  const upto = {
    DateUpdated: new Date(),
    Scope: 5,
  };

  const raw = await userModel.downto(data.id, upto);
  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({
    message: "Downto bidder to seller successfully",
  });
});

module.exports = router;
