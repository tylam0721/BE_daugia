const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (_ , file, cb) {
      if(file.mimetype == 'audio/mp3'){
          cb(null,'./public/audios');
      }
      
      if(file.mimetype == 'image/jpg'
        | file.mimetype == 'image/png' | file.mimetype == 'image/jpeg'){
          cb(null,'./public/uploads');
      }
    },
    filename: function (_ , file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;