var express = require('express');
var router = express.Router();
//pdfmake.addFonts(Roboto);
var PdfPrinter = require('pdfmake');
var fs = require('fs');

router.post('/', (req, res, next) => {
    var fonts = {
        Roboto: {
          normal: './fonts/Roboto-Regular.ttf',
          bold: './fonts/Roboto-Medium.ttf',
          italics: './fonts/Roboto-Italic.ttf',
          bolditalics: './fonts/Roboto-MediumItalic.ttf'
        }
      }
    var printer = new PdfPrinter(fonts);
  
    var docDefinition = {
        content: [
            req.body.data.replace( /(<([^>]+)>)/ig, ''),
            req.body.filename,
        ]
    };
  
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
    return res.status(200).json({
      data: {
          status: 200,
          type: "success",
          message: "PDF Created"
      }
  });
});

module.exports = router;