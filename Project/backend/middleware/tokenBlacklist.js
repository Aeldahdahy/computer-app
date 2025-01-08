const blacklist = new Set();

const addToBlacklist = (token) => {
    blacklist.add(token);
};

const isBlacklisted = (token) => {
    // console.log('Checking if token is blacklisted:', token);
    return blacklist.has(token);
};


module.exports = { addToBlacklist, isBlacklisted };