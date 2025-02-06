const pdf = require('html-pdf');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv').parse;

hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

exports.CSV = (res, data, filename) => {
  const csv = json2csv(data);

  res.attachment(filename);
  res.send(csv);
};
exports.jobAplicationMail= async(data,templateName) => {
    console.log(__dirname);
    const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
    console.log(templatePath);
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = hbs.compile(templateHtml);
     const html=compiledTemplate({
      ...data,
    currentYear: new Date().getFullYear()
    })

    return html;
//     const options = {
//       format: 'A5',
//       orientation: 'portrait', // Landscape or portrait
//       border: '10mm',
//       footer: {
//           height: '10mm',
//           contents: {
//               default: '<span style="color: #444;">© 2025  Report </span>', // Footer content
//           }
//       }
//   };

//     pdf.create(html,options).toStream((err, stream) => {
//         if (err) return res.status(500).send('Failed to generate PDF');
//         res.attachment(filename);
//         stream.pipe(res);
//     });

};
