const express = require('express');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const excelFile = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', excelFile.name);

  excelFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Call the C# console application
    const csharpAppPath = path.join(__dirname, 'path/to/your/csharp/app.exe'); // Adjust this path to your C# app
    exec(`"${csharpAppPath}" "${uploadPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing C# app:', stderr);
        return res.status(500).send('Error processing file.');
      }

      const processedFilePath = path.join(__dirname, 'processed_files', excelFile.name);
      res.download(processedFilePath, 'processed_file.xlsx', (err) => {
        if (err) console.error('Error sending file:', err);

        // Clean up uploaded and processed files
        fs.unlinkSync(uploadPath);
        fs.unlinkSync(processedFilePath);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
