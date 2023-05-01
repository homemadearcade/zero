import { response, Router } from 'express';
import { generateGetUrl, generatePutUrl, recordS3Upload, s3Multer } from '../../services/aws';
// import axios from 'axios'
import request from 'request'

const router = Router();

// router.get('/generate-put-url', (req,res)=>{
//   try {
//     // Both Key and ContentType are defined in the client side.
//     // Key refers to the remote name of the file.
//     // ContentType refers to the MIME content type, in this case image/jpeg
//     const { Key, ContentType } =  req.query;
//     // console.log(Key, ContentType)
//     generatePutUrl(Key, ContentType).then(url => {
//       res.send({url});
//     })
//     .catch(err => {
//       res.send(err);
//     });
//   } catch(e) {
//     res.send(e)
//   }
// });

// router.put('/post', s3Multer, recordS3Upload, (req, res) => {
//   res.status(200).send({success: true})
// });

router.get('/:key*', async (req,res)=>{

  try {
    const key = req.params.key + req.params[0]
    // Key refers to the remote name of the file.
    const url = await generateGetUrl(key)
    .catch(err => {
      res.send(err);
    });

    request.get(url).pipe(res)
  } catch(e) {
    res.send(e)
  }

});


export default router;