const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const fs = require("fs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("index");
});

const carData = require("./car-data");

// -----------------------------//

app.get("/api/car-data", function (req, res) {
    res.json(carData);
});

// -----------------------------//

app.get("/carTable.handlebars", function (req, res) {
    fs.readFile(
        path.join(__dirname, "views", "carTable.handlebars"),
        "utf8",
        (err, data) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            res.send(data);
        }
    );
});





// -----------------------------//

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
