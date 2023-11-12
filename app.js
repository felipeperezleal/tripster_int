/*jslint node: true */
"use strict";


var soap = require('soap');
var express = require('express');
var fs = require('fs');

// the splitter function, used by the service
function getFlights(args) {
  return {
      Flight: [
          {
              airport_origin: { _id: "1", airport_origin_name: "Aeropuerto A" },
              airport_destination: { _id: "2", airport_destino_name: "Aeropuerto B" },
              flight_airline: "Airline X",
              flight_seat_class: "Economy",
              flight_escalas: [],
              flight_available_seats: 100,
              flight_ticket_price: 500.00
          }
          // ... más vuelos según sea necesario
      ]
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
  console.log("Check http://localhost:" + port + wsdl_path +"?wsdl to see if the service is working");
});