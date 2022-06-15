const express = reqiure("express");

const iitbControllers = require("./controllers/iitb-apis");

console.log(iitbControllers);

const POST = 5764;

const app = express();
app.use(express.static('public'));

app.post('/eng-hin', iitbControllers.eng2hin);

app.post('/hin-eng', function(req,res,next) {
    res.send("hindi to english");
});

app.listen(PORT, () => {
    console.log(`server listenning on PORT = ${PORT}`);
})