const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Document = require('../models/document');
const File = require('../models/file');

const multer = require('multer')
const path = require('path');
const Sharp = require('sharp');
const mkdirp = require('mkdirp');
const config = require('../../config');
const diskStorage = require('../utils/diskStorage');
var fs = require('fs');

const maxCount = 12

const rs = () =>
  Math.random()
    .toString(36)
    .slice(-3);

const storage = diskStorage({
  destination: (req, file, cb) => {
    // const dir = '/' + rs() + '/' + rs();
    const dir = '/' + rs();
    req.dir = dir;

    // console.log('DDDDDD',config.DESTINATION);
    mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir));
  },
  filename: async (req, file, cb) => {
    // const fileName = Date.now().toString(36) + path.extname(file.originalname);
    const fileName = file.originalname;
    const dir = req.dir;
    
    file.filePath = dir + '/' + fileName;

    cb(null, fileName);
  },
  sharp: (req, file, cb) => {
    const resizer = Sharp()
      .resize(1024, 768)
      .toFormat('jpg')
      .jpeg({
        quality: 40,
        progressive: true
      });
    cb(null, resizer);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = 'EXTENTION';
      return cb(err);
    }
    cb(null, true);
  }
}).array('file', maxCount);

// File.sync({force: true})

exports.save_files = (req, res) => {
  upload(req, res, async err => {
    let error = '';
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = 'Max file size 2mb!';
      }
      if (err.code === 'EXTENTION') {
        error = 'Only jpeg, png!';
      }
      if (err.code === 'NOPOST') {
        error = 'Reload page!';
      }
    }
    
    // console.log('FF//////////',req.files);

    // const basePath = `http://localhost:${config.port}`
    // const filesData = req.files.map(file => ({path: basePath + file.filePath, filePath: file.filePath, type: 'image', documentId: req.body.documentId}))
    // const filesData = req.files.map(file => ({path: file.filePath, filePath: file.filePath, type: 'image'}))
    const filesData = req.files.map(file => (
      {
        path: file.filePath,
        filePath: file.filePath,
        type: file.mimetype.split('/')[0],
        documentId: req.body.documentId
      }))
    
    const files = await File.bulkCreate(filesData)

    // const document = await Document.findOne({where: {id: req.body.documentId}})
    // const result = await document.setFiles(files)

    // if (!document) {
    //   const err = new Error('No document');
    //   err.code = 'NOPOST';
    //   // return cb(err);
    // }

    // // upload/
    // const upload = await models.Upload.create({
    //   owner: userId,
    //   path: dir + '/' + fileName
    // });

    // // write to post
    // const uploads = post.uploads;
    // uploads.unshift(upload.id);
    // post.uploads = uploads;
    // await post.save();

    res.json({
      ok: !error,
      error,
      filePath: req.filePath
    });
  });
}

exports.remove_file = async function(req, res) {

  const file = await File.findOne({where: {id: req.params.id}})
  const filePath = file.filePath
  fs.unlink(`${config.DESTINATION}${filePath}`, (e,f)=> {
    fs.rmdir(path.dirname(`${config.DESTINATION}${filePath}`), (e,f)=> console.log(e,f))
  })

  await file.destroy()
  res.send('delated')
}

// fs.unlink(`${config.DESTINATION}/got/unicorn.jpg`, (e,f)=> console.log(e,f))
// fs.rmdir(path.dirname(`${config.DESTINATION}/got/unicorn.jpg`), (e,f)=> console.log(e,f))





// storage._removeFile(null, {
//   path: `${config.DESTINATION}/l7c/unicorn.jpg`,
//   destination: `${config.DESTINATION}/l7c`,
//   fileName: `unicorn.jpg`
// }, (e, r) => {
//   console.log('e',e); 
//   console.log('r',r); 

// })


// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     console.log('CBF//////////////////////////////////', file);
//     console.log('CBF//////////////////////////////////', file.originalname);
//     callback(null, 'uploads')
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname)
//     // callback(null, file.fieldname + '-' + Date.now())
//   }
// });


// exports.save_files = async (req, res) => {
  
//   upload(req, res, function (err) {
//     console.log('F<<<<<<<<<<', req.files);
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//     }

//     res.send({message:'ok', files: req.files})
//   })
// }


// const fs = require('fs')
// const tmp = require('tmp');
// const typeIs = require('type-is');
// const util = require("util");
// const path = require('path');

// const config = {
//   // 10 mb
//   maxFileSize: 10485760,
//   allowedMimeTypes: ["image/gif", "image/jpeg", "image/pjpeg", "image/png", "image/webp"],
//   allowedExtensions: ['png', 'gif', 'jpeg', 'jpg', 'webp']
// };
// // Функция для подсчёта байт в потоке пришедших к текщему моменту времени. Будучи "присоединённой" к потоку, следит за новыми чанками. При появлении кидает событие "progress" и передёт пришедший чанк далее (вниз по потоку).
// function StreamLength(){return this instanceof StreamLength?(Transform.call(this),void(this.bytes=0)):new StreamLength}
// var Transform=require("stream").Transform;
// util.inherits(StreamLength,Transform);
// StreamLength.prototype._transform=function(a,b,c){this.bytes+=a.length;this.push(a);this.emit("progress");c()};


// exports.save_files = async (request, response) => {
//   request.on('error', function(err) {
//     console.error(err);
//     response.statusCode = 400;
//     response.end();
//   });
//   response.on('error', function(err) {
//     console.error(err);
//   });
//   var found;
//   if ((found = request.url.match(/^\/([^\/]+?)\/?$/i)) !== null && request.method === 'PUT') {
//     let filename = found[1];
//     let contentLength = request.headers['content-length'];
//     let contentType = request.headers['content-type'];
//     if ((typeof config.maxFileSize !== 'undefined') && !isNaN(+config.maxFileSize) && !isNaN(+contentLength) && +contentLength > +config.maxFileSize) {
//       response.statusCode = 413;
//       response.end();
//     // } else if ((typeof contentType !== 'undefined') && (typeof config.allowedMimeTypes !== 'undefined') && !typeIs.is(contentType, config.allowedMimeTypes)) {
//     //   response.statusCode = 422;
//     //   response.end();
//     // } else if ((typeof config.allowedExtensions !== 'undefined') && !config.allowedExtensions.includes(path.extname(filename).toLowerCase().replace('.', ''))) {
//     //   res.statusCode = 422;
//     //   res.end();
//     } else {
//       let internalErrorResponse = () => {
//         response.statusCode = 500;
//         response.end();
//       };
//       tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
//         if (err) internalErrorResponse();
//         else {
//           let outStream = fs.createWriteStream(null, {fd});
//           let aborted = false;
//           let abortWithError = function(uploadError) {
//             if (!aborted) {
//               aborted = true;
//               if (uploadError.code !== 'EEXIST') {
//                 cleanupCallback(internalErrorResponse);
//               } else {
//                 internalErrorResponse();
//               }
//             }
//           };
//           outStream.on('finish', function () {
//             console.log('P///////////////////', path);
//             fs.copyFile(path, 'uploads.jpg', err => {
//               if(err) throw err
//             // к этому моменту файл полность загружен путь до файла лежит в переменной "path". Остаётся только проверить тип файла и в случае несоответствия удалить его.
//             // тут какие-то ваши операции. Наример, если вы работаете с картинками, то тут самое время пережать их в нужные вам размеры.
//             // после всех операций удаляем временный файл
//             cleanupCallback();
//             // возвращаем пользователю ответ
//             response.statusCode = 201;
//             response.end();
//             })

//           });
//           outStream.on('error', function(err) {
//             abortWithError(err);
//           });
//           let counter = new StreamLength();
//           counter.on('progress', function(){
//             if (((!isNaN(+contentLength) && counter.bytes > +contentLength) || (counter.bytes > +config.maxFileSize)) && !aborted) {
//               aborted = true;
//               cleanupCallback(function () {
//                 res.statusCode = 413;
//                 res.end();
//               });
//             }
//           });
//           request.on('abort', function () {
//             cleanupCallback();
//           });
//           request.on('aborted', function () {
//             cleanupCallback();
//           });
//           request.pipe(counter).pipe(outStream);
//         }
//       });
//     }
//   } else {
//     response.statusCode = 404;
//     response.end();
//   }

// };





