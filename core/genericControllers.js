const Generic = require('./genericMethods');
module.exports = (table) => {
    return {
        get : (...args) => Generic.get(table, ...args),
        sync : (...args) => Generic.sync(table, ...args),
        put : (...args) =>  Generic.put(table, ...args),
        post : (...args) => Generic.post(table, ...args),
        delete : (...args) => Generic.delete(table, ...args),
        count : (...args) => Generic.count(table, ...args),
    }
}