const multer = require('multer')

const uploadPic = x => {
    return multer({
        dest: 'avatars'
    }).single(x)
}

module.exports = uploadPic