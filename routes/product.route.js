const express = require('express');

const productModel = require('../services/models/product.model');
const router = express.Router();

    router.get('/', async (req, res) =>{

    const data = await productModel.findAll();
    if (data === 0) {
      return res.status(500).json("was row ecfect").end();
    }
    res.status(202).json({data});
  });

  router.get('/delete/:id', async (req, res) =>{
    const data = req.params.id;

    const row = await productModel.delete(data);
    if (row === 0) {
      return res.status(500).json("was row ecfect").end();
    }
    res.status(202).json({
        message: "add product successfully"
    });
  });

  router.post('/add', async (req, res) =>{
    const data = req.body;

    var a = new Date().toString();

    console.log(a);

    const product = {
        IdCategory: data.IdCategory,
        Name: data.Name,
        StartingPrice: data.StartingPrice,
        StepPrice: data.StepPrice,
        NowPrice: data.NowPrice,
        Description: data.Description,
        IsUpdatedDescription: 0,
        IsCheckReturn: data.IsCheckReturn,
        DateCreated: new Date(),
        DateUpdated: new Date(),
        Isdeleted: 0
    } 

    const raw = await productModel.add(product);
    if (raw === 0) {
      return res.status(500).json("was row ecfect").end();
    }
    res.status(202).json({
        message: "add product successfully"
    });
  });

module.exports = router;