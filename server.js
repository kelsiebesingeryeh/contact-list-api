const express = require('express');
const app = express();
const contactData = require('./contactData.js');
const cors = require("cors");


app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.locals.contactInformation = contactData;

app.listen(app.get('port'), () => {
    console.log(`Now listening on port ${app.get('port')}!`)
});

app.get('/api/v1/contactInformation', (request, response) => {
    response.status(200).json(app.locals.contactInformation)
});

app.get('/api/v1/contactInfomation/:id', (request, response) => {
    const reqId = parseInt(request.params.id);
    const foundContact = app.locals.contactInformation.find(info => {
        return info.id === reqId;
    });

    if (!foundContact) {
        response.status(404).json({error: `No contact information with an id of ${reqId} was found!`})
    } else {
        response.status(200).json(foundContact)
    }
});

app.post('/api/v1/contactInformation', (request, response) => {
    const id = Date.now();
    const contact = request.body;

    for (let requiredParameter of ['name', 'phone', 'email']) {
        if (!contact[requiredParameter]) {
            response.status(422).json({
                error: `Required body is missing a required parameter of ${requiredParameter}. Expected format is: {name: <String>, phone: <String>, email: <String>}`
            })
        } else {
            app.locals.contactInformation.push({...contact, id});
            response.status(201).json({...contact, id});
        }
    }
})