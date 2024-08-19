'use client'
import React, { useRef, useState } from 'react';
import { ImFilePicture } from "react-icons/im";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {storage} from "@/firebase/firebaseStorage"
import Image from 'next/image';
import { Button, Upload, Form, Grid, Input, theme, Typography } from "antd";


import { useUserStore } from '@/store/store';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';

const ImgInput = () => {

  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("")
  const fileInputRef = useRef(null);
  const {setCoverImage} = useUserStore();


const props = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        toast.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
      handleFileChange(info.file.originFileObj);
    },
  };

  const handleUploadFile = async(file) => {
    toast.success("Uploading cover image...")
    // console.log(`File: ${file}`)
    if (file) {
    //   setUploadProgressCapt/ion("Uploading...")
      const name = file.name
      const storageRef = ref(storage, `image/${name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            // setAttachmentProgress(progress) // to show progress upload

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          console.error(error.message)
            toast.error("Error uploading cover image")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //url is download url of file
            // setDownloadURL(url)
            console.log(url)
            setCoverImage(url)
            toast.success("Cover image uploaded successfully")
            // setAttachments({type: "image",url: url})
            // console.log(attachments)
            // setUploadProgressCaption("Uploaded")
          })
        },
      )
    } else {
      console.error('File not found');
      toast.error("File not found")
    }
  }

  const handleFileChange = async (file) => {
    //   const file = e.target.files[0];
      console.log(`Selected: ${file}`)
      if (file) {
    // console.log(file)
      setSelectedFile(file);
      // console.log("Selected file:", file.name);
    }

    if (file && file.size < 5000000) {
      console.log(file)
      setSelectedFile(file)
      await handleUploadFile(file);
    } else {
      console.error('File size to large')
      setUploadProgressCaption("You can upload image less than 5 MB")
    }
  
  };

  return (
    <div className='my-5'>
       {/* <input
        type="file"
        htmlFor="imgFile"
        accept=".jpg,.png"
        onChange={handleFileChange}
        id="imgFile"
        disabled={attachments.length === 5}
        style={{ display: 'none' }}
      />
    <label onClick={doOpen} style={{ display: 'inline-block', cursor: 'pointer', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
     
      <span >
        <ImFilePicture className="icon" />
      </span> */}
    {/* </label> */}

    <Upload maxCount={1} {...props}>
    <Button icon={<UploadOutlined />}>Upload Series Cover</Button>
  </Upload>
  </div>
  
  );
};

export default ImgInput;