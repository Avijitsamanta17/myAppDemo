const multer = require('multer');
const path = require("path")

const { v4: uuidv4 } = require('uuid');

const Storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/uploads/')
    },
    filename: function(req, file, cb){
        const uniqeFilename = uuidv4();
        cb(null, uniqeFilename + path.extname(file.originalname));
    }
})

const upload = multer({storage: Storage});

module.exports = upload;