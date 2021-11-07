const mailer = require('../utils/mailer');
const cron=require("cron");
const userModel=require("../services/models/user.model");
const moment=require("moment");

module.exports = {
    startConJob: function (dateEnd, productId) {
        dateEnd=moment(dateEnd, 'DD-MM-YYYY HH:mm:ss');
        const resullt=userModel.findWinnerBidder();
        const job = new cron.CronJob(`0 0 6 6 9 ? 2021`, () => {
            mailer.send({
                from: 'webdaugiaonline@gmail.com',
                to: `${resullt.Email}`,
                subject: 'Web Đấu Giá Online: Xác thực tài khoản của bạn.',
                html: `
                    Xin chào ${resullt.userName}, cảm ơn bạn đã tham gia web Đấu Giá Online.
                    <br> 
                    Bạn đã là người chiến thắng, link sản phẩm
                    <a href="https://localhost:3000/product/${productId}"> đây </a> 
                    để xem thông tin chi tiết sản phẩm.
                    <br>
                    (Đây là thư tự động vui lòng không phản hồi)`
            })
        }, null, true, 'Asia/Ho_Chi_Minh'
        )
        job.start();
    }
}