import React from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


function Camera():JSX.Element {
  // image is a 'preview', before image is selected to be POSTED to database
  const [image, setImage] = useState('');
  const [resizedImg, setResizedImg] = useState('');
  // input Ref's for cameras
  const envInputRef = useRef<HTMLInputElement>(null);
  // const selfieInputRef = useRef<HTMLInputElement>(null);

  const resizePhoto = (image) => {
    const maxSizeInMB = 4;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    let dataURL:string;

    const img = new Image();
    img.src = image;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const newWidth = Math.sqrt(maxSizeInBytes * aspectRatio);
      const newHeight = Math.sqrt(maxSizeInBytes / aspectRatio);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx!.drawImage(img, 0, 0, newWidth, newHeight);
      const quality = 0.8;
      dataURL = canvas.toDataURL('image/jpeg', quality);
      // set resized image
      setResizedImg(dataURL);
    };
  };


  // function to access photo data
  // check for env or user id
  // set id to be dynamic, either environment or user (button click)
  // after lunch fix errors

  // axios post request to s3
  const postBucket = (name:string, imageData:string) => {
    axios.post('/api/images', {
      imageName: name,
      base64: imageData
    });
  };

  // reads image file and converts to base64
  const sendPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    // access image file from file picker
    const selectedFile = e.target.files![0];

    // File Reader to read selectedFile as base 64
    const reader = new FileReader();

    if (selectedFile) {
      // read result as data url
      reader.readAsDataURL(selectedFile);
    }

    // setState and read generate dataURL
    reader.addEventListener('load', () => {

      setImage(reader.result as string);
      // call resize here
      resizePhoto(reader.result);
      }, false);
  

  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    // prevent default to stop loop
    e.preventDefault();
    sendPic(e);
  };

  const handleClick = () => {
    // set unique name with uuid to be used as image Key, for gallery view
    const name = uuidv4();
    postBucket(name, resizedImg);
  };

  // button to toggle environment or user

  return (
    <div>
      {/* <label htmlFor="environment"></label> */}
      <br />
      <input
        type="file"
        ref={envInputRef}
        id="environment"
        style={{ display: 'none' }}
        capture="environment"
        accept="image/*"
        onChange={handleChange}
      />
      <input
        type="button"
        value="Take Photo"
        onClick={() => envInputRef.current!.click()}
      />
      <br />
      {/* <label htmlFor="user">Capture user:</label> */}
      <br />
      {/* <input
        type="file"
        ref={selfieInputRef}
        id="user"
        style={{ display: 'none' }}
        capture="user"
        accept="image/*"
        onChange={handleChange}
      />
      <input
        type="button"
        value="Take Selfie"
        onClick={() => selfieInputRef.current!.click()}
      />
      <br /> */}
      <img src={image} height="200"/>
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default Camera;
