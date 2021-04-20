// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

import { ChangeEvent } from 'react';

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
