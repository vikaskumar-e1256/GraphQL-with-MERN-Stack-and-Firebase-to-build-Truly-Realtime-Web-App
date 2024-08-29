const express = require('express');
require('dotenv').config();


const app = express();


// api end point
app.get('/rest', (req, res) =>
{
    res.json({
        data: 'Hello world'
    });
});


const port = process.env.PORT || 8001;

app.listen(port, () =>
{
    console.log(`Server is running at ${port}`);
})
