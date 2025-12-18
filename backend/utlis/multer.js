import multer from "multer";

const gallerystorage = multer.diskStorage({
  destination: "uploads/gallery",

  filename: function (req, files, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + files.originalname);
  },
});

const Servicestorage = multer.diskStorage({
  destination: "uploads/service",

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const Staffstorage = multer.diskStorage({
  destination: "uploads/staff",

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const uploadgallery = multer({ storage: gallerystorage });
export const uploadservice = multer({ storage: Servicestorage });
export const uploadstaff = multer({ storage: Staffstorage });
