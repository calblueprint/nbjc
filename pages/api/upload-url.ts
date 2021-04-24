import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_Key,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersioin: 'v4',
  });

  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `${process.env.PATH_NAME}${req.query.file}`,
    },
    Expires: 60,
    Conditions: [
      ['content-length-range', 0, 1048576],
      ['starts-with', '$key', 'images/'],
    ],
  });

  res.status(200).json(post);
}
