const multer = require('multer')

const uploadPic = formBodyKey => {
    return multer({
        dest: formBodyKey + 's',
        limits: {
            fileSize: 50000,
        },
        fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
                return cb(new Error('Please upload a png or jpg file.'))
            }

            cb(undefined, true)
        }
    }).single(formBodyKey)
}

module.exports = uploadPic