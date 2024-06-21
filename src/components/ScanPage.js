import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';

function ScanPage() {
  const { classId } = useParams();
  const [image, setImage] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    // Send the captured image to backend for face recognition
    sendImageForFaceRecognition(imageSrc);
  }, [webcamRef]);

  const sendImageForFaceRecognition = async (imageData) => {
    try {
      const { data } = await axios.post(`http://localhost:5001/api/faceRecognition/class/${classId}`, {
        image: imageData
      });
      setRecognizedStudents((prevRecognizedStudents) => [
        ...prevRecognizedStudents,
        ...data.recognizedNames,
      ]);    //   console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Error sending image for face recognition:', error);
    }
  };

  return (
    <div>
      <h2>Scan</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture</button>
      {image && (
        <img src={image} alt="Captured" />
      )}
      <h3>Captured Students:</h3>
      <ul>
      {recognizedStudents.map((studentName, index) => (
          <div key={index}>{studentName}</div>
        ))}
      </ul>
    </div>
  );
}

export default ScanPage;
