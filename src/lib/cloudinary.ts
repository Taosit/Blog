const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (imageUrl: string) => {
  const preset = {
    upload_preset: "ml_default",
  };
  const options = { folder: "blogs/", public_id: "my_name" };
  return await cloudinary.uploader.upload(imageUrl, preset);
};

export { cloudinary, uploadToCloudinary };
