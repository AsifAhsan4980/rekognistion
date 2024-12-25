import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, ProgressBar } from "react-bootstrap";

const App = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
          "https://yyx6kluzh4.execute-api.ap-south-1.amazonaws.com/prod/", // Replace with your API Gateway URL
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            },
          }
      );

      setResults(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setProgress(0);
    }
  };

  return (
      <Container>
        <h1>Image/Video Analysis with AWS Rekognition</h1>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label column={''}>Select an image or video:</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        {progress > 0 && <ProgressBar now={progress} label={`${progress}%`} />}
        <Button onClick={handleUpload} disabled={!file}>
          Upload and Analyze
        </Button>
        {results && (
            <div className="mt-4">
              <h3>Analysis Results:</h3>
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
        )}
      </Container>
  );
};

export default App;
