/*jslint node: true */
"use strict";

var axios = require('axios');
var soap = require('soap');
var express = require('express');
var fs = require('fs');

// the splitter function, used by the service
async function getFlights(args) {
  let apiGatewayUrl = 'http://host.docker.internal:5000/graphql';
  let graphqlQuery = {
    query: `
        query {
          getFlights {
            airport_origin {
              airport_origin_name
            }
            airport_destination {
              airport_destino_name
            }
            flight_airline
            flight_escalas {
              airport_name
            }
            flight_seat_class
            flight_available_seats
            flight_ticket_price
          }
        }`
  };

  let response = await axios.post(apiGatewayUrl, graphqlQuery);
  console.log(response.data.data.getFlights);

  return {
    Flight: response.data.data.getFlights
  };
}


// the service
var serviceObject = {
  FlightService: {
    FlightServiceSoapPort: {
      GetFlights: getFlights
    }
  }
};


// load the WSDL file
var xml = fs.readFileSync('service.wsdl', 'utf8');
// create express app
var app = express();

// root handler
app.get('/', function (req, res) {
  res.send('SOAP service is running, try <a href="http://localhost:8000/wsdl?wsdl">WSDL</a>');
})

// Launch the server and listen
var port = 8000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log("Check http://localhost:" + port + wsdl_path + "?wsdl to see if the service is working");
});