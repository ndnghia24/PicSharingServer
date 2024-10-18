const port = process.env.PORT || 3000;
const express = require('express');
const cors = require("cors");
const postRouter = require('./routes/postRouter');
const requestIp = require('request-ip');


////// This is the code snippet that you need to add to your index.js file //////

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(requestIp.mw());

////// This is the code snippet that you need to add to your index.js file //////


app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/posts", postRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));