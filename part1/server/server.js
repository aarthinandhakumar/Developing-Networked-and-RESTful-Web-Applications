const net = require('net'); // Import the 'net' module for creating a TCP server
const colors = require('colors'); // Import the 'colors' module for colorizing console output
const cities = require('./zipCodeModule_v2'); // Import the zip code module

// Create a TCP server
const server = net.createServer((socket) => {
    console.log("Client connection...".red); // Log when a client connects

    // Handle the 'end' event when the client disconnects
    socket.on('end', () => {
        console.log("Client disconnected...".red); // Log when a client disconnects
    });

    // Handle 'data' event to process data received from the client
    socket.on('data', (data) => {
        let input = data.toString().trim(); // Convert the data to a string and trim whitespace
        console.log(colors.blue('...Received %s'), input); // Log the received input

        // Split the input into a command and its arguments
        let [command, ...args] = input.split(',');

        let response;

        // Switch statement to handle different commands
        switch (command.trim()) {
            case 'lookupByZipCode':
                response = cities.lookupByZipCode(args[0].trim()); // Lookup by zip code
                break;
            case 'lookupByCityState':
                response = cities.lookupByCityState(args[0].trim(), args[1].trim()); // Lookup by city and state
                break;
            case 'getPopulationByState':
                response = cities.getPopulationByState(args[0].trim()); // Get population by state
                break;
            default:
                response = { error: 'Invalid request' }; // Handle invalid commands
        }

        // Check if the response is empty or invalid
        if (!response || Object.keys(response).length === 0) {
            response = { error: 'Invalid request' };
        }

        socket.write(JSON.stringify(response) + '\n'); // Send the response back to the client as a JSON string
    });
});

// Listen for client connections on port 3000
server.listen(3000, () => {
    console.log("Listening for connections on port 3000"); // Log when the server starts listening
});