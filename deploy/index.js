const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "..", "build")));
app.use('/app/static', express.static(path.join(__dirname, "..", "build","static")));
 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`UI started on port ${port}`);
});