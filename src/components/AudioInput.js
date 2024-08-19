'use client'
import React, { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {storage} from "@/firebase/firebaseStorage"

import { Button, Upload, } from "antd";


import { useUserStore } from '@/store/store';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';

const ImgInput = () => {

  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("")
  const fileInputRef = useRef(null);
  const {setAudioURL} = useUserStore();


const props = {
    beforeUpload: (file) => {
      const isAudio = file.type === 'audio/mpeg' || file.type === 'audio/wav';
      if (!isAudio) {
        toast.error(`${file.name} is not a mp3 or wav file`);
      }
      return isAudio || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
      handleFileChange(info.file.originFileObj);
    },
  };

  const handleUploadFile = async(file) => {
    toast.success("Uploading audio file...")
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
            toast.error("Error uploading audio file")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //url is download url of file
            // setDownloadURL(url)
            console.log(url)
            setAudioURL(url)
            toast.success("Audio uploaded successfully")
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
    if (file && file.size < 50000000) { 
      console.log(file)
      setSelectedFile(file)
      await handleUploadFile(file);
    } else {
      console.error('File size to large')
      toast.error("You can upload audio less than 50 MB")
    }
  
  };

  return (
    <div className='my-5'>

    <Upload maxCount={1} {...props}>
    <Button icon={<UploadOutlined />}>Upload Podcast Audio</Button>
  </Upload>
  </div>
  
  );
};

export default ImgInput;