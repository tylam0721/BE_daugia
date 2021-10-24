const express = require("express");

const categoryModel = require("../services/models/category.model");
const productModel = require("../services/models/product.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await categoryModel.findAll();
  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ data });
});

router.get("/delete/:id", async (req, res) => {
  const data = req.params.id;

  const checkExist = await productModel.findbyCategory(data);

  if (checkExist != 0) {
    return res
      .status(500)
      .json({ message: "Cannot delete Category because is exist product" })
      .end();
  }

  const row = await categoryModel.delete(data);
  if (row === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  return res.status(202).json({
    message: "add category successfully",
  });
});

router.post("/add", async (req, res) => {
  const data = req.body.body;

  const category = {
    Name: data.Name,
    DateCreated: new Date(),
    Isdeleted: 0,
  };

  const raw = await categoryModel.add(category);
  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({
    message: "add category successfully",
  });
});

router.post("/update", async (req, res) => {
  const data = req.body;

  const category = {
    Name: data.Name,
    DateCreated: new Date(),
  };

  const raw = await categoryModel.update(data.id, category);
  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({
    message: "add category successfully",
  });
});

module.exports = router;
