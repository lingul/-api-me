const formData = require('form-data');
const Mailgun = require('mailgun.js');
const API_KEY = 'XXXXXXXXXX';
const DOMAIN = 'XXXXXXXXXXX';

var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
    sendMail();
    res.status(201).json({
        data: {
            status: 201,
            type: "success",
            message: "Mail sent!"
        }
    });
  
    function sendMail() {
        console.log("Here!!!!");
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
            username: 'api',
            key: API_KEY
        });
        console.log("UTANFÖR");
        mg.messages.create('sandboxad00b18c49cc4918873a27723aa294e2.mailgun.org', {
            from: 'Linnea <mailgun@sandboxad00b18c49cc4918873a27723aa294e2.mailgun.org>',
            to: 'linneagullmak96@gmail.com',
            subject: 'Inbjudan till redigering',
            text: 'Registrera dig här. Kopera länken (https://jsramverk-editor-ligm19.azurewebsites.net/register) och klista in i valfri webbläsare.'
          })
        .then(msg => console.log('MSG', msg)) // logs response data
        .catch(err => console.log('ERRor', err)); // logs any error
    };
  
});
  
module.exports = router;
