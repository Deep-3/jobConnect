const json2csv = require('json2csv').parse;


exports.ReportCSV = (data) => {
    const csv = json2csv(data);
  
    return csv
  };
  