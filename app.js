const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();



app.use(express.static("public"));
app.use(bodyParser.urlencoded({
   extended: true
}));

app.get("/", function(req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

   const FirstName = req.body.FirstName;
   const LastName = req.body.LastName;
   const email = req.body.email;
   // console.log(FirstName, LastName, email);

   const data = {
      members: [{
         email_address: email,
         status: "subscribed",
         merge_fields: {
            FNAME: FirstName,
            LNAME: LastName,
         }
      }]
   }

   const jsonData = JSON.stringify(data);
   // console.log(jsonData);

   const url = "https://us7.api.mailchimp.com/3.0/lists/0a3a227be8";

   const options = {
      method: "POST",
      auth: "nazwa:656120029f9d2dc178155e4051fbf660-us7",
   }


   const request = https.request(url, options, function(ress) {

      ress.on("data", function(data) {
         // console.log(JSON.parse(data));
         console.log(JSON.parse(data).error_count);
         if (JSON.parse(data).error_count === 0) {
            res.sendFile(__dirname + "/success.html");
         } else {
            res.sendFile(__dirname + "/failure.html");
         }
      });
      // console.log(ress.statusCode);
   });
   request.write(jsonData);
   request.end();
});


app.post("/failure", function(req, res){
   res.redirect("/");
});




app.listen(process.env.PORT || 2137, function() {
   console.log("Serwer is running on port 2137");
});


//API Key
//656120029f9d2dc178155e4051fbf660-us7

//audience ID 
//0a3a227be8