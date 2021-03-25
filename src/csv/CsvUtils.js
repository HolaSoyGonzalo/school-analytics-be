const lodash = require("lodash");

const mapper = {
  parseExams: (examsData) => {
    return parseData(examsData);
  },

  parseStudents: (studentsData) => {
    return parseData(studentsData);
  },
};

// Questo livello di indirezione non è necessario al momento, ma lo mettiamo perché l'idea dell'oggetto mapper è di esporre un'interfaccia del tipo:
// {
//		parseExams: prende examsData, ritorna lista di ExamRequests
// 		parseStudents: prende studentsData, ritorna lista di StudentRequests
// 		...
// }
//
// in cui tutte funzionano allo stesso modo, solo che tornano risultati diversi.
const parseData = (rawData) => {
  const lines = String(rawData).split("\n");
  const headers = parseRow(lines[0]);
  return lodash
    .tail(lines)
    .map((row) => lodash.zipObject(headers, parseRow(row)));
};

const parseRow = (row) => {
  return row.split(",").map((element) => lodash.trim(element, "\r").trim('"'));
};

module.exports = mapper;
