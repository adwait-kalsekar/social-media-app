import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

// CSS Components
import './ImageUpload.css'

// User Components
import { uploadPost } from './firebase';

const ImageUpload = ({ username }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = (e) => {
        console.log('Upload');
        setCaption("");
        setImage(null);
        uploadPost(image, caption, username, setProgress);
    }

    return (
        <div className='imageUpload'>
            <progress className='imagUpload__progress' value={progress} max="100" />
            <input type='text' placeholder='Enter A Caption....' onChange={(e) => setCaption(e.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>UPLOAD</Button>
        </div>
    );
}

export default ImageUpload;