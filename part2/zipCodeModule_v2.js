const data = require('./zips.json');// Importing data from zips.json

module.exports.lookupByZipCode = (zip) => {// Function to lookup by zip code
    return data.find(entry => entry._id === zip);
};

module.exports.lookupByCityState = (city, state) => {// Function to lookup by city and state
    const filteredData = data.filter(entry => entry.city.toUpperCase() === city.toUpperCase() && entry.state.toUpperCase() === state.toUpperCase())
                               .map(entry => ({ zip: entry._id, pop: entry.pop }));

    const result = {
        city,
        state,
        data: filteredData
    };

    if (filteredData.length === 0) {
        result.data = [];
    }

    return result;
};

module.exports.getPopulationByState = (state) => {// Function to get population by state
    const totalPopulation = data.reduce((accumulator, entry) => {
        return entry.state.toUpperCase() === state.toUpperCase() ? accumulator + entry.pop : accumulator;
    }, 0);

    return {
        state,
        pop: totalPopulation
    };
};