const axios = require("axios");
const DOCUMENTS = require("../data/latest.json");
const fs = require("fs");
const { stringify } = require("csv-stringify");

const records = DOCUMENTS.records;

let endpoints = [];
const delayIncrement = 500;
let failed_links = []
let delay = 0;
for (i = 0; i < records.length; i++) {
  if (records[i]["Internet URL of Document"]) {
    let endpoint = records[i]["Internet URL of Document"];
    let doc_id = records[i]["Document ID"]
    endpoints.push(
      new Promise((resolve) => {
        setTimeout(resolve, delay)})
          .then(() => {
            axios.get(endpoint, {timeout: 5000})
          .then((data) => {
            /*console.log(endpoint, data.status);*/
          })
          .catch((error) => {
            // console.log([doc_id, endpoint, error.code].join('\t'))
            failed_links.push({documentId: doc_id, url: endpoint, error: error.code})
        })})
    );
    delay += delayIncrement;
  }
}

Promise.all(endpoints).finally(() => {
  console.log("checked all sources.");
  let output = `| Document ID      | Error | Link
| ----------- | ----------- | --------------------|
`;

failed_links.forEach((val) => output += `|${val.documentId} | ${val.error} | ${val.url} |\n`)

console.log(output)


});

