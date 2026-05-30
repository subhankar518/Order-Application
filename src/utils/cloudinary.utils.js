import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (mediaData) => {
  const buffer =
    mediaData?.buffer || Buffer.from(await mediaData.arrayBuffer());

  const uploadMedia = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: mediaFile }, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadMedia;
};

export { uploadOnCloudinary };
