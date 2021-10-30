const express = require("express");

const productModel = require("../services/models/product.model");
const descriptionModel = require("../services/models/description.model");
const userModal = require("../services/models/user.model");
const desModel = require("../services/models/description.model");
const multer = require("multer");
const imageModel = require("../services/models/image.model");
const upload = multer();
const { v4: uuidv4 } = require("uuid");
const { cloudinary } = require("../utils/cloudinary");
const router = express.Router();

var image_found = [];
var user_seller_found = [];
var user_buyer_found = [];
var des_found = [];
var product_found = [];

const formatJson = (product, userbuyer, userSeller, images, des) => {
  return {
    id: product.id,
    IdCategory: product.IdCategory,
    IdUserBuyer: product.IdUserBuyer,
    IdUserSeller: product.IdUserSeller,
    Name: product.Name,
    StartingPrice: product.StartingPrice,
    StepPrice: product.StepPrice,
    NowPrice: product.NowPrice,
    Description: product.Description,
    IsUpdatedDescription: product.IsUpdatedDescription,
    IsCheckReturn: product.IsCheckReturn,
    DateCreated: product.DateUpdated,
    DateUpdated: product.DateUpdated,
    Isdeleted: product.Isdeleted,
    UserSeller: userbuyer,
    UserBuyer: userSeller,
    images: images,
    des: des,
  };
};

const formatJsonImage = (image_product) => {
  return {
    id: image_product.id,
    Name: image_product.Name,
    IdProduct: image_product.IdProduct,
  };
};

const formatJsonDes = (des_product) => {
  return {
    Note: des_product.Note,
    IdProduct: des_product.IdProduct,
  };
};

const formatJsonUser = (user) => {
  return {
    Firstname: user.Firstname,
    Lastname: user.Lastname,
    RateGood: user.RateGood,
    RateBad: user.RateBad,
    Email: user.Email,
  };
};

// GET ALL
router.get("/", async (req, res) => {
  const data = await productModel.findAll();
  const getuser = await userModal.findAll();
  const getimage = await imageModel.findAll();
  const getdes = await desModel.findAll();
  product_found = [];

  data.map((r) => {
    image_found = [];
    user_buyer_found = [];
    user_seller_found = [];
    des_found = [];
    getimage.map((i) => {
      if (i.IdProduct == r.id) {
        image_found.push(formatJsonImage(i));
      }
    });
    getuser.map((u) => {
      if (u.id == r.IdUserBuyer) {
        user_buyer_found.push(formatJsonUser(u));
      }
      if (u.id == r.IdUserSeller) {
        user_seller_found.push(formatJsonUser(u));
      }
    });
    getdes.map((d) => {
      if (d.IdProduct == r.id) {
        des_found.push(formatJsonDes(d));
      }
    });
    product_found.push(
      formatJson(r, user_buyer_found, user_seller_found, image_found, des_found)
    );
  });

  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json(product_found);
});

//GET Product by category
router.get("/category/:id", async (req, res) => {
  const id = req.params.id;
  const data = await productModel.findAll();
  const getuser = await userModal.findAll();
  const getimage = await imageModel.findAll();
  const getdes = await desModel.findAll();
  product_found = [];

  data.map((r) => {
    image_found = [];
    user_buyer_found = [];
    user_seller_found = [];
    des_found = [];
    if (r.IdCategory == id) {
      getimage.map((i) => {
        if (i.IdProduct == r.id) {
          image_found.push(formatJsonImage(i));
        }
      });
      getuser.map((u) => {
        if (u.id == r.IdUserBuyer) {
          user_buyer_found.push(formatJsonUser(u));
        }
        if (u.id == r.IdUserSeller) {
          user_seller_found.push(formatJsonUser(u));
        }
      });
      getdes.map((d) => {
        if (d.IdProduct == r.id) {
          des_found.push(formatJsonDes(d));
        }
      });
      product_found.push(
        formatJson(
          r,
          user_buyer_found,
          user_seller_found,
          image_found,
          des_found
        )
      );
    }
  });

  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json(product_found);
});

//GET Product by product
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await productModel.findAll();
  const getuser = await userModal.findAll();
  const getimage = await imageModel.findAll();
  const getdes = await desModel.findAll();
  product_found = [];

  data.map((r) => {
    image_found = [];
    user_buyer_found = [];
    user_seller_found = [];
    des_found = [];
    if (r.id == id) {
      getimage.map((i) => {
        if (i.IdProduct == r.id) {
          image_found.push(formatJsonImage(i));
        }
      });
      getuser.map((u) => {
        if (u.id == r.IdUserBuyer) {
          user_buyer_found.push(formatJsonUser(u));
        }
        if (u.id == r.IdUserSeller) {
          user_seller_found.push(formatJsonUser(u));
        }
      });
      getdes.map((d) => {
        if (d.IdProduct == r.id) {
          des_found.push(formatJsonDes(d));
        }
      });
      product_found.push(
        formatJson(
          r,
          user_buyer_found,
          user_seller_found,
          image_found,
          des_found
        )
      );
    }
  });

  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json(product_found);
});

// DELETE product
router.get("/delete/:id", async (req, res) => {
  const data = req.params.id;

  const row = await productModel.delete(data);
  if (row === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({
    message: "add product successfully",
  });
});
// ADD product
router.post("/add", async (req, res) => {
  const data = req.body;

  const product = {
    IdCategory: data.IdCategory,
    IdUserSeller: data.IdUserSeller,
    Name: data.Name,
    StartingPrice: data.StartingPrice,
    StepPrice: data.StepPrice,
    NowPrice: data.NowPrice,
    Description: data.Description,
    IsUpdatedDescription: 0,
    IsCheckReturn: data.IsCheckReturn,
    DateCreated: new Date(),
    DateUpdated: new Date(),
    Isdeleted: 0,
  };

  const raw = await productModel.add(product);
  if (raw[0] === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({productId: raw[0]});
});
// UPDATE Product
router.post("/update", async (req, res) => {
  const data = req.body;

  const product = {
    IdCategory: data.IdCategory,
    Name: data.Name,
    StartingPrice: data.StartingPrice,
    StepPrice: data.StepPrice,
    NowPrice: data.NowPrice,
    DateUpdated: new Date(),
  };

  const raw = await productModel.update(product, data.id);
  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  }
  res.status(202).json({
    message: "add product successfully",
  });
});

// API Update Description product
router.post("/add-des", async (req, res) => {
  const data = req.body;

  var a = new Date().toString();

  console.log(a);

  const description = {
    IdProduct: data.IdProduct,
    Note: data.Note,
  };

  const raw = await descriptionModel.add(description);

  if (raw === 0) {
    return res.status(500).json("was row ecfect").end();
  } else {
    await productModel.updateIsCheckReturn(data.IdProduct);
  }
  res.status(202).json({
    message: "add description product successfully",
  });
});

// API UPload Image của một product
router.post("/uploadImage", upload.any(), async (req, res) => {
  const id = req.body.IdProduct;

  for (let i = 0; i < req.files.length; i++) {
    let anh = "product_" + id + "_" + uuidv4().toString();
    let minetype = req.files[i].originalname.split(".")[1];
    await cloudinary.uploader.upload(
      `data:${req.files[i].mimetype};base64,${req.files[i].buffer.toString(
        "base64"
      )}`,
      { public_id: `product/${anh}`, overwrite: false },
      function (error) {
        console.log(error);
      }
    );
    const image = {
      name: anh + "." + minetype,
      IdProduct: id,
      DateCreated: new Date(),
    };
    await imageModel.add(image);
  }

  return res.status(202).json("Upload image successfully");
});

// API UPload Image của một product
router.post("/UpdateImage", upload.any(), async (req, res) => {
  const idroom = req.body.IdProduct;
  const del = req.body.updatedImages;

  const arrdel = del.toString().split(",");

  if (arrdel != null) {
    console.log(arrdel);
    arrdel.forEach((element) => {
      imageModel.deleteImg(element, idroom);
    });
  }

  for (let i = 0; i < req.files.length; i++) {
    let anh = "product_" + idroom + "_" + uuidv4().toString();
    let minetype = req.files[i].originalname.split(".")[1];
    await cloudinary.uploader.upload(
      `data:${req.files[i].mimetype};base64,${req.files[i].buffer.toString(
        "base64"
      )}`,
      { public_id: `product/${anh}`, overwrite: false },
      function (error) {
        console.log(error);
      }
    );
    const image = {
      name: anh + "." + minetype,
      IdProduct: id,
      DateCreated: new Date(),
    };
    await imageModel.add(image);
  }

  return res.status(202).json("Upload image successfully");
});

module.exports = router;
