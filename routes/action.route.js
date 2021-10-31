const express = require("express");

const userModel = require("../services/models/user.model");
const actionModel = require("../services/models/action.model");
const productMode = require("../services/models/product.model");
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
  const check = await userModel.findById(id);

  if (check.RateGood == 0 && check.RateBad ==0){

    // gửi yêu cầu đến người bán hàng cho phép đâu giá sản phẩm trường hợp chưa có lượt đấu giá

    return res.status(201).json({
        message: "Người dùng chưa từng ra giá sản phẩm"
    }).end();
  }

    if((check.RateGood /(check.RateBad + check.RateGood)) >= 0.8){
        return res.status(202).json({
            message: "Người dùng đủ điều kiện ra giá sản phẩm"
        }).end();
    }
  res.status(500).json({
    message: "Người dùng không đủ điều kiện",
  });
});

router.post("/buys", async (req, res) => {

    const data = req.body;

    const checkPriceProduct = await productMode.findById(data.IdProduct);

    console.log(checkPriceProduct);
    const nowdate = new Date();

    console.log(data.Price);
    console.log(checkPriceProduct[0].NowPrice);
    console.log(checkPriceProduct[0].StepPrice);
    console.log(nowdate);
    console.log(checkPriceProduct[0].DateEnd);



    if((data.Price > (checkPriceProduct[0].NowPrice +  checkPriceProduct[0].StepPrice)) 
    && (checkPriceProduct[0].DateEnd > nowdate)){
        const auction = {
            IdProduct: data.IdProduct,
            Price: data.Price,
            IdUser: data.IdUser,
            DateStart: new Date(),
            DateEnd: new Date(),
            Isdeleted: 0,
            DateCreated: new Date(),
            DateUpdated: new Date()
        }
    
        const raw = await actionModel.add(auction);
    
        if (raw === 0 || raw == null) { 
          return res.status(500).json("was row ecfect").end();
        }
      
        return res.status(202).json({ raw });
    }
    return res.status(500).json({ message: "Bạn đấu giá không thành công" });
  });

module.exports = router;
