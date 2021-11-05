const express = require("express");

const userModel = require("../services/models/user.model");
const actionModel = require("../services/models/action.model");
const productMode = require("../services/models/product.model");
const desModel = require("../services/models/description.model");
const imageModel = require("../services/models/image.model");
const watchlistModel=require("../services/models/watchList.model");
const rejectedModel = require("../services/models/rejected.model");
const router = express.Router();

router.post("/rategood", async (req, res) => {
  const id = req.body.idUser;
  const data = await userModel.findById(id);
  var good = data.RateGood + 1;

  const raw = await userModel.postRateGood(good, id);

  if (raw === 0 && raw == null) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ message: "Bạn đã đánh giá good" });
});

router.post("/ratebad", async (req, res) => {
  const id = req.body.idUser;
  const data = await userModel.findById(id);
  var bad = data.RateBad + 1;

  const raw = await userModel.postRateBad(bad, id);

  if (raw === 0 && raw == null) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ message: "Bạn đã đánh giá bad" });
});

router.get("/", async (req, res) => {
  const data = await userModel.findByBidder();
  if (data === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  return res.status(202).json({ data });
});

router.post("/check", async (req, res) => {
  const id = req.body.idUser;
  const productId = req.body.idProduct;
  const check = await userModel.findById(id);
  const checkProd = await productMode.findById(productId);
  const rejectedCheck = await rejectedModel.findByUserId(id);

  if(rejectedCheck.length > 0)
  {
    res.status(500).json({
      message: "Người dùng không đủ điều kiện",
    }).end();
  }

  if (check.RateGood == 0 && check.RateBad == 0) {
    if (checkProd[0].allowUnrated == 1) {
      return res
        .status(202)
        .json({
          message: "Cho phép người dùng chưa từng ra giá tham gia",
        })
        .end();
    } 
    return res
    .status(201)
    .json({
      message: "Không cho phép người dùng chưa từng ra giá sản phẩm",
    })
    .end();
  }

  if (check.RateGood / (check.RateBad + check.RateGood) >= 0.8) {
    return res
      .status(202)
      .json({
        message: "Người dùng đủ điều kiện ra giá sản phẩm",
      })
      .end();
  }
  res.status(500).json({
    message: "Người dùng không đủ điều kiện",
  });
});

router.post("/buys", async (req, res) => {
  const data = req.body;

  const checkPriceProduct = await productMode.findById(data.IdProduct);

  const nowdate = new Date();
  if (
    (data.Price >=
      checkPriceProduct[0].NowPrice + checkPriceProduct[0].StepPrice) &&
    (checkPriceProduct[0].DateEnd > nowdate)
  ) {
    const auction = {
      IdProduct: data.IdProduct,
      Price: data.Price,
      IdUser: data.IdUser,
      DateStart: new Date(),
      DateEnd: new Date(),
      Isdeleted: 0,
      DateCreated: new Date(),
      DateUpdated: new Date(),
    };

    const raw = await actionModel.add(auction);

    if (raw === 0 || raw == null) {
      return res.status(500).json("was row ecfect").end();
    }

    await productMode.updatePrice(data.IdProduct, data.Price, data.IdUser);
    const sendData = await getBiddersList(data.IdProduct);
    broadcastAll(JSON.stringify(["updateProductDetail",sendData]));


    return res.status(202).json({ raw });
  }
  return res.status(500).json({ message: "Bạn đấu giá không thành công" });
});

router.post("/reject", async(req,res)=>{
  const data={
    IdProduct: req.body.IdProduct,
    IdBuyer: req.body.IdBuyer,
    Isdeleted: 0
  }

  const check = await rejectedModel.findAll();
  const checkAuction = await actionModel.findAll();

  let record_found = [];
  check.map((r)=>{
    if(r.IdBuyer === data.IdBuyer && r.IdProduct === data.IdProduct)
    {
      record_found.push(r);
    }
  });

  let auctionRecord_found = [];
  checkAuction.map((r)=>{
    if(r.IdUser === data.IdBuyer && r.IdProduct === data.IdProduct)
    {
      auctionRecord_found.push(r);
    }
  });

  if(record_found > 0 || auctionRecord_found === 0)
  {
    return res.status(500).json({message:'user đã bị từ chối hoặc chưa đấu giá trong sản phẩm này'}).end();
  }

  const addRecord = await rejectedModel.add(data);

  const removeUser = await actionModel.deleteByUserIdAndProductId(data.IdBuyer,data.IdProduct);

  if (addRecord === 0 || removeUser === 0) {
    return res.status(500).json("was row ecfect").end();
  }

  const sendData = await getBiddersList(data.IdProduct);
  broadcastAll(JSON.stringify(["updateProductDetail",sendData]));

  return res.status(202).json({data});
})

const formatJson = (product, userbuyer, userSeller, images, des, watch_list) => {
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
    UserSeller: userSeller,
    UserBuyer:  userbuyer,
    DateEnd: product.DateEnd,
    images: images,
    des: des,
    watch_list,
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

const formatJsonBuyer = (buyer)=>{
  return {
    id: buyer.id,
    DateStart: buyer.DateStart,
    Lastname: buyer.Lastname,
    Price: buyer.Price,
  };
}

const formatJsonUser = (user) => {
  return {
    Firstname: user.Firstname,
    Lastname: user.Lastname,
    RateGood: user.RateGood,
    RateBad: user.RateBad,
    Email: user.Email,
  };
};

const formatJsonWatchList=(watch_list)=>{
  return {
    watchlistid: watch_list.id,
    Isdeleted: watch_list.Isdeleted,
    IdUserWatch: watch_list.IdUser,
  }
}
const getBiddersList = async function(id){
  const data = await productMode.findAll();
  const getuser = await userModel.findAll();
  const getaction = await actionModel.findAll();
  const getimage = await imageModel.findAll();
  const getdes = await desModel.findAll();
  const getwatchlist=await watchlistModel.findAll();
  const getbuyerInformation = await actionModel.findByIdGroupBy(id,'IdUser');
  product_found = [];

  data.map((r) => {
    image_found = [];
    user_buyer_found = [];
    user_seller_found = [];
    watch_list_found=[];
    des_found = [];
    infor_found =[];
    if (r.id == id) {
      getimage.map((i) => {
        if (i.IdProduct == r.id) {
          image_found.push(formatJsonImage(i));
        }
      });
      getaction.map((b) => {
        if (b.IdProduct == r.id) {
          getuser.map((u)=>{
            if(u.id == b.IdUser)
            {
              user_buyer_found.push(formatJsonBuyer({
                id: u.id,
                Lastname: u.Lastname,
                DateStart: b.DateStart,
                Price: b.Price
              }));
            }
          })
        }
      });
      getuser.map((u)=>{
        if (u.id == r.IdUserSeller) {
          user_seller_found.push(formatJsonUser(u));
        }
      });
      getdes.map((d) => {
        if (d.IdProduct == r.id) {
          des_found.push(formatJsonDes(d));
        }
      });
      getwatchlist.map((w) => {
        if(w.IdProduct == r.id){
          watch_list_found.push(formatJsonWatchList(w))
        }
      });

      getuser.map((u)=>{
        getbuyerInformation.map((infor)=>{
          if(u.id == infor.IdUser)
          {
            infor_found.push(formatJsonUser(u));
          }
        })
        
      });

      product_found.push(
        formatJson(
          r,
          user_buyer_found.sort((a, b) => Number(b.Price) - Number(a.Price)),
          user_seller_found,
          image_found,
          des_found,
          watch_list_found,
          infor_found
        )
      );
    }
  });

  if (data === 0) {
    return {}
  }
  return product_found;
}

module.exports = router;

