import { Router } from 'express';
import aws from '../../services/aws';
const router = Router();

router.get('/generate-put-url', (req,res)=>{
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  // ContentType refers to the MIME content type, in this case image/jpeg
  const { Key, ContentType } =  req.query;
  console.log(Key, ContentType)
  aws.generatePutUrl(Key, ContentType).then(url => {
    res.send({url});
  })
  .catch(err => {
    res.send(err);
  });
});

export default router;