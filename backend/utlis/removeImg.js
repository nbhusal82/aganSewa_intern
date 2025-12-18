import fs from "fs";

export const removeImage = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.log(`file not found :${path}`);
  }
};
//remove image from uploads
