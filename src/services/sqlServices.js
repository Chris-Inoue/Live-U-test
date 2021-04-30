const tp = require('tedious-promises');
const dbconfig = require('./dbconfig.json');

tp.setConnectionConfig(dbconfig);

function sqlCodeInsertInto(table, collumItem, collumCod, valueItem, valueCod) {

  return new Promise(resolve => {
    tp.sql(`INSERT INTO  ${table} (${collumItem}, ${collumCod}) VALUES ('${valueItem}', '${valueCod}')`)
    .execute()
    .then(function(results) {
      resolve(console.log("Insert completed on table " + table))
    }).fail(function(err) {
      console.log(err);
    })
  });
  
}

function sqlSelectSoma(table, cod) {

  return new Promise(resolve => {
    tp.sql(`SELECT soma FROM ${table} WHERE cod = ${cod}`)
    .execute()
    .then(function(results) {
      resolve(Number(results[0].soma))
    }).fail(function(err) {
      console.log(err);
    })
  });

}

function sqlSelectResultadoSoma(total) {

  return new Promise(resolve => {
    tp.sql(`SELECT tbs_animais.animal, tbs_cores.cor, tbs_paises.pais FROM tbs_cores
    INNER JOIN tbs_animais ON tbs_animais.total = tbs_cores.total
    INNER JOIN tbs_paises ON tbs_paises.total = tbs_cores.total
    LEFT JOIN tbs_cores_excluidas ON tbs_cores.cor = tbs_cores_excluidas.cor
    WHERE tbs_cores.total = ${total} AND tbs_cores_excluidas.cor IS NULL`)
    .execute()
    .then(function(results) {
      resolve(results)
    }).fail(function(err) {
      console.log(err);
    })
  });

}

module.exports = {
  sqlCodeInsertInto,
  sqlSelectSoma,
  sqlSelectResultadoSoma
}