const express = require('express');

const productModel = require('../services/models/product.model');

const multer = require('multer');
const imageModel = require("../services/models/image.model");
const upload = multer()

const { v4: uuidv4 } = require("uuid");
const  {cloudinary} = require("../utils/cloudinary");
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

  router.post("/uploadImage", upload.any(), async (req, res) => {
    const id = req.body.IdProduct;

    for (let i = 0; i < req.files.length; i++) {
      let anh = "product_" + id + "_" + uuidv4().toString();
      let minetype = req.files[i].originalname.split(".")[1]
       await cloudinary.uploader.upload(
        `data:${req.files[i].mimetype};base64,${req.files[i].buffer.toString(
          "base64"
        )}`,
        { public_id: `product/${anh}`, overwrite: false },
        function (error) {
          console.log(error)
        }
      );
      const image = {
        name: anh + "." + minetype,
        IdProduct: id,
        DateCreated: new Date()
      };
      await imageModel.add(image);
    }

  return res.status(202).json("Upload image successfully");
});

router.post("/UpdateImage", upload.any(), async (req, res) => {
  const idroom = req.body.IdProduct;
  const del = req.body.updatedImages;

  const arrdel = del.toString().split(',');
  
  if(arrdel != null){
    console.log(arrdel);
    arrdel.forEach(element => {
      imageModel.deleteImg(element, idroom)
    });
  }

  for (let i = 0; i < req.files.length; i++) {
    let anh = "product_" + idroom + "_" + uuidv4().toString();
    let minetype = req.files[i].originalname.split(".")[1]
     await cloudinary.uploader.upload(
      `data:${req.files[i].mimetype};base64,${req.files[i].buffer.toString(
        "base64"
      )}`,
      { public_id: `product/${anh}`, overwrite: false },
      function (error) {
        console.log(error)
      }
    );
    const image = {
        name: anh + "." + minetype,
        IdProduct: id,
        DateCreated: new Date()
      };
    await imageModel.add(image);
  }

return res.status(202).json("Upload image successfully");
});

module.exports = router;