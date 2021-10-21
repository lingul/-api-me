const formData = require('form-data');
const Mailgun = require('mailgun.js');
const API_KEY = '2b5d63ef15cac74bb5016ee9312b8811-2bf328a5-fb0d8a70';
const DOMAIN = 'https://api.mailgun.net/v3/sandboxad00b18c49cc4918873a27723aa294e2.mailgun.org/messages';

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
            key: API_KEY /*,
            public_key: 'pubkey-ac6344a6a2164a83edc6d315b3157b8d',
            url: 'https://api.mailgun.net'*/
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
  
  /*
  curl -s --user 'api:2b5d63ef15cac74bb5016ee9312b8811-2bf328a5-fb0d8a70' \
  https://api.mailgun.net/v3/sandboxad00b18c49cc4918873a27723aa294e2.mailgun.org/messages \
      -F from='Linnea <mailgun@sandboxad00b18c49cc4918873a27723aa294e2.mailgun.org>' \
      -F to=linneagullmak96@gmail.com \
      -F subject='Inbjudan till redigering' \
      -F text='Registrera dig här. Kopera länken (https://jsramverk-editor-ligm19.azurewebsites.net/register) och klista in i valfri webbläsare.'
  {
    "message": "Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings."
  }%
  */