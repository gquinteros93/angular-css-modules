const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const publicPath = path.resolve(__dirname, '../dist/angular-css-modules');
app.use(express.static(publicPath));
app.get('/*', function(req,res) {
    res.sendFile(path.resolve(__dirname, '../dist/angular-css-module/index.html'));
  }
);
  
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});