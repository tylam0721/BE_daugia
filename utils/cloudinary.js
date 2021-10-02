const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "",
    api_key: "699666469822748",
    api_secret: "0KC_7z0qDbxpCIfkkl6iRT5-fuk",
    secure: true
});

module.exports = {cloudinary};