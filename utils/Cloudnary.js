const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "de9eigd4s",
    api_key: "673691544911287",
    api_secret: "9wIHOifcC2cNo4StcbQuCPs_Rgs"
})


const uploadImage = async (file) => {
    try {
        const imageUrl = await cloudinary.uploader.upload(file)
        return imageUrl.secure_url
    } catch (error) {
        console.log(error)
    }
}

const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        throw error;
    }
};

module.exports = {
    uploadImage, deleteImage
}