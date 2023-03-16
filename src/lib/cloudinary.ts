const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (imageUrl: string) => {
  const preset = {
    upload_preset: "ml_default",
  };
  const options = {
    folder: "blog",
  };
  return await cloudinary.uploader.upload(imageUrl, preset, options);
};

export { cloudinary, uploadToCloudinary };
