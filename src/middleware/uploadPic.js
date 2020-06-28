const multer = require('multer')

const uploadPic = () => {
    return multer({
        limits: {
            fileSize: 50000,
        },
        fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
                return cb(new Error('Please upload a png or jpg file.'))
            }

            cb(undefined, true)
        }
    }).single('avatar')
}

module.exports = uploadPic