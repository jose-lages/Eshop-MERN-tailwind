const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// const cloudinaryUploadImg = async (fileToUpload) => {
//   return new Promise((resolve) => {
//     cloudinary.UploadStream.upload(fileToUpload, (result) => {
//       resolve({ url: result.secure_url }, { resource_type: 'auto' });
//     });
//   });
// };

const cloudinaryUploadImg = (fileToUpload) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      fileToUpload,
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.log(error);
          throw error;
        }
        resolve({ url: result.secure_url });
      }
    );
  });
};

module.exports = { cloudinaryUploadImg };
