## Part 1: Net Module

### Server (server/server.js)
1. The server listens for client connections.
2. Processes commands:
    - `lookupByZipCode, <zip>`
    - `lookupByCityState, <city>, <state>`
    - `getPopulationByState, <state>`
3. Uses `zipCodeModule` functions and `JSON.stringify` to send results back to the client.

### Client (client/client.js)
1. Reads commands from the user’s console in a loop.
2. Sends commands to the server.
3. Prints received data from the server to the console.

### Testing
- Run the server in one window.
- Run a client in a separate window and test the communication.

## Part 2: Express, Handlebars & REST Endpoints

### Express Server (server.js)
1. **GET request – /**: Render the home view with a welcome message.
2. **GET request – /zip**: 
    - If `id` query parameter is present, lookup the data and render `lookupByZipView`.
    - Otherwise, render `lookupByZipForm`.
3. **POST request – /zip**: Lookup the data for `id` in request body and render `lookupByZipView`.
4. **GET request – /zip/:id**: Handle JSON, XML, and HTML requests using named routing `id` parameter.
5. **GET request – /city**: 
    - If `city` and `state` query parameters are present, lookup the data and render `lookupByCityStateView`.
    - Otherwise, render `lookupByCityStateForm`.
6. **POST request – /city**: Lookup the data for `state` and `city` in request body and render `lookupByCityStateView`.
7. **GET request – /city/:city/state/:state**: Handle JSON, XML, and HTML requests using named routing `city` and `state` parameters.
8. **GET request – /pop**: 
    - If `state` query parameter is present, lookup the data and render `populationView`.
    - Otherwise, render `populationForm`.
9. **GET request – /pop/:state**: Handle JSON, XML, and HTML requests using named routing `state` parameter.

### Views
- **home.handlebars**: Welcome message.
- **lookupByZipForm.handlebars**: Form for Zip Code lookup.
- **lookupByZipView.handlebars**: View for Zip Code lookup result.
- **lookupByCityStateForm.handlebars**: Form for City and State lookup.
- **lookupByCityStateView.handlebars**: View for City and State lookup result.
- **populationForm.handlebars**: Form for State Population lookup.
- **populationView.handlebars**: View for State Population result.

### Testing
- Test the HTML requests using a browser.
- Test JSON and XML requests using `curl` or Postman.

## License
This project is licensed under the MIT License - see the [LICENSE](License.txt) file for details.
