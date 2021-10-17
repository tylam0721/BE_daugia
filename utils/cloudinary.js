const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "duq9gro8k",
    api_key: "184952385926747",
    api_secret: "h-GH71DZ7SRqtrK4rI_z-12QP8U",
    secure: true
});

module.exports = {cloudinary};