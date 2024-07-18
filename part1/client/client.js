const net = require('net');
const colors = require('colors');
const readline = require('readline');

// Create readline interface for reading user input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to read a message from the user and send it to the server
const readMessage = (client) => {
  rl.question("Enter Command: ", (line) => {
    // Send the user's command to the server
    client.write(line);
    if (line === "bye") {
      // If the user types 'bye', end the client connection
      client.end();
    } else {
      // Otherwise, read the next command after a short delay
      setTimeout(() => {
        readMessage(client);
      }, 2000);
    }
  });
};

// Connect to the server on port 3000
const client = net.connect({ port: 3000 }, () => {
  console.log("Connected to server");
  readMessage(client); // Start reading commands from the user
});

// Handle the 'end' event for when the client disconnects
client.on('end', () => {
  console.log("Client disconnected...");
  rl.close(); // Close readline interface when client disconnects
});

// Handle incoming data from the server
client.on('data', (data) => {
  const response = JSON.parse(data); // Parse the JSON data from the server
  console.log(colors.green('...Received')); // Log the response with green color
  if (response.error) {
    console.log(colors.green(`"${response.error}"`)); // Print the error message within quotes on the next line
  } else {
    console.log(colors.green(JSON.stringify(response))); // Print the JSON response on the next line
  }
});