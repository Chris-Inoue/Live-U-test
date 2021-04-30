const express = require("express");
const apiGetAnimalAndColorAndCountry = require("./services/apiService");

const app = express();

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(__dirname));

app.get("/", (request, response) => {
  response.render("index");
});

app.post(
  "/",
  (request, response, next) => {
    apiGetAnimalAndColorAndCountry(request.body).then(function (result) {
      request.result = result;
      return next();
    });
  },
  function (request, response) {
    const [{ animal, cor, pais }] = request.result;

    response.render("indexSubmited", { animal: animal, cor: cor, pais: pais });

    return response.status(201).send();
  }
);

app.listen(3333);
