// vanilla mongodb way of connecting to a DB;
const { MongoClient } = require('mongodb');

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://mandrake:mandrake37@mongouniversitytasks.o1uvl.mongodb.net/node_udemy?authSource=admin&replicaSet=MongoUniversityTasks-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true')
        .then((client) => {
            console.log('Connected');
            _db = client.db()
            cb();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw('No database found!');
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
