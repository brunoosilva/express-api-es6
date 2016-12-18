const MongoInMemory = require('mongo-in-memory');
const port = 8000;
const databaseName = 'expressApi';

var mongoServerInstance = new MongoInMemory(port);

mongoServerInstance.start((error, config) => {
    if (error) {
        console.error(error);

        process.exit(1);
    } else {
        console.log(`Mongo started: ${mongoServerInstance.getMongouri(databaseName)}`);

        // Connect with mongo
        const fixtures = require('pow-mongodb-fixtures').connect(databaseName, {
            host: config.host,
            port: config.port
        });

        // Import all data
        fixtures.load(__dirname + '/mongo_mock/fixtures', () => {
            console.log('Data imported for Mongo');
        });
    }
});

process.on('exit', (code) => {
    mongoServerInstance.stop((error) => {
        if (error) {
            console.error(`Error stop MongoMemory: ${error}`);
            process.exit(1);
        } else {
            console.log('Mongo foi finalizado');
            process.exit(0);
        }
    });
});
