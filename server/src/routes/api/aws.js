import { response, Router } from 'express';
import aws from '../../services/aws';
// import axios from 'axios'
import request from 'request'

const router = Router();

router.get('/generate-put-url', (req,res)=>{
  try {
    // Both Key and ContentType are defined in the client side.
    // Key refers to the remote name of the file.
    // ContentType refers to the MIME content type, in this case image/jpeg
    const { Key, ContentType } =  req.query;
    // console.log(Key, ContentType)
    aws.generatePutUrl(Key, ContentType).then(url => {
      res.send({url});
    })
    .catch(err => {
      res.send(err);
    });
  } catch(e) {
    res.send(e)
  }

});

// router.put('/post', async (req,res)=>{

//   console.log('post',req.query)
//   try {
//     const { Key, ContentType } =  req.query;
//     // Key refers to the remote name of the file.
//     const url = await aws.generatePutUrl(Key, ContentType)
//     .catch(err => {
//       res.send(err);
//     });

//     console.log(url, Key, req.body)

//     return await axios.put('https://immense-fjord-18543.herokuapp.com/' + generatedPutUrl.data.url, file, {
//       ...options,
//       headers: {
//         'Content-Type': contentType || 'image/png',
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//       }
//     })

    

//     request.put(url, { body: req.body }).pipe(res)
//   } catch(e) {
//     res.send(e)
//   }

// });


router.get('/:key*', async (req,res)=>{

  try {
    const key = req.params.key + req.params[0]
    // Key refers to the remote name of the file.
    const url = await aws.generateGetUrl(key)
    .catch(err => {
      res.send(err);
    });

    request.get(url).pipe(res)
  } catch(e) {
    res.send(e)
  }

});


export default router;