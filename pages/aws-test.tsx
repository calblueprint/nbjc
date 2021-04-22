// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

import { ChangeEvent } from 'react';
import aws from 'aws-sdk';

// display img START
function myCtrl($scope, $timeout) {
  aws.config.update({
    accessKeyId: 'AKIAUQ63KKG6P533GHGA',
    secretAccessKey: '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',
  });
  aws.config.region = 'us-west-1';

  function encode(data) {
    const str = data.reduce(function (a, b) {
      return a + String.fromCharCode(b);
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  const testImg = '2C117AAD-09F1-4467-9795-D47D73F84D0A.jpg';

  const bucket = new aws.S3({ params: { Bucket: 'nbjc-dev' } });

  bucket.getObject({ Key: testImg }, function (err, file) {
    $timeout(function () {
      $scope.s3url = `data:image/jpeg;base64,${encode(file.Body)}`;
    }, 1);
  });
}
// display img END

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Upload() {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const uploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-url?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (upload.ok) {
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
  };

  return (
    <div>
      <p>Upload a .png or .pqg image (max 1MB)</p>
      <input
        onChange={uploadPhoto}
        type="file"
        accept="image/png, image/jpeg"
      />
    </div>
  );
}
