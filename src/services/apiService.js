const axios = require("axios");
const {
  sqlCodeInsertInto,
  sqlSelectSoma,
  sqlSelectResultadoSoma,
} = require("./sqlServices");

Object.defineProperty(Array.prototype, "parseArrayToKeyValue", {
  value: function () {
    var keyValueArray = [];
    var numberOfPropertiesInKeyValue = 2;

    for (var index = 0; index < this.length; index += numberOfPropertiesInKeyValue)
      keyValueArray.push(this.slice(index, index + numberOfPropertiesInKeyValue));
    return keyValueArray;
  },
});

async function apiGetAnimalAndColorAndCountry(body) {
  const { nome, sobrenome, email } = body;

  const urlParameters = new URLSearchParams(body);

  return new Promise(function (resolve) {
    getApiCodes(urlParameters).then(async (res) => {
      const codMap = new Map(res.data.split("#").parseArrayToKeyValue());

      const namePrefix = "n";
      const lastNamePrefix = "s";
      const emailPrefix = "e";

      const nomeCod = parseInt(codMap.get(namePrefix));
      const sobrenomeCod = parseInt(codMap.get(lastNamePrefix));
      const emailCod = parseInt(codMap.get(emailPrefix));

      await insertCodesInTheDatabase(
        nomeCod,
        sobrenomeCod,
        emailCod,
        nome,
        sobrenome,
        email
      )
        .then(async function () {
          return await getTotalSum(nomeCod, sobrenomeCod, emailCod);
        })
        .then(function (somaTotal) {
          resolve(sqlSelectResultadoSoma(somaTotal));
        });
    });
  });
}

function getApiCodes(urlParameters) {
  return axios({
    method: "post",
    url: "http://138.68.29.250:8082/",
    data: urlParameters,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
}

function insertCodesInTheDatabase(
  nomeCod,
  sobrenomeCod,
  emailCod,
  nome,
  sobrenome,
  email
) {
  return Promise.all([
    sqlCodeInsertInto("tbs_nome", "nome", "cod", nome, nomeCod),
    sqlCodeInsertInto(
      "tbs_sobrenome",
      "sobrenome",
      "cod",
      sobrenome,
      sobrenomeCod
    ),
    sqlCodeInsertInto("tbs_email", "email", "cod", email, emailCod),
  ]);
}

async function getTotalSum(nomeCod, sobrenomeCod, emailCod) {
  const [nomeSoma, sobrenomeSoma, emailSoma] = await Promise.all([
    sqlSelectSoma("tbs_cod_nome", nomeCod),
    sqlSelectSoma("tbs_cod_sobrenome", sobrenomeCod),
    sqlSelectSoma("tbs_cod_email", emailCod),
  ]);

  return [
    nomeSoma,
    sobrenomeSoma,
    emailSoma,
    nomeCod,
    sobrenomeCod,
    emailCod,
  ].reduce((total, sum) => total + sum);
}

module.exports = apiGetAnimalAndColorAndCountry;
