import multer from "multer";
import path from "path";
import createError from "../utils/createError.js";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads");
    },
    filename: function(req,file,cb){
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
});

const limits = {
    fileSize: 1024*1024*5
}

const fileFilter = (req,file,cb) => {
    if (file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        cb(new Error("File not supported"), false);
    }
}

export const uploader = multer({
    storage,
    limits,
    fileFilter
});

export const handleUploader = (req, res, next) => {
    uploader.single("image")(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return next(createError(err));
                }
                return next(createError(err));
            }
            return next(createError(err));
        }

        if (!req.file) {
            return next(createError(new Error("File not uploaded")));
        }

        next();
    });
};
