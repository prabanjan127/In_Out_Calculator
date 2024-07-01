import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob',
      });

      // Create a download link for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Excel Processor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload and Process</button>
      {downloadLink && (
        <div>
          <a href={downloadLink} download="processed_file.xlsx">Download Processed File</a>
        </div>
      )}
    </div>
  );
}

export default App;
