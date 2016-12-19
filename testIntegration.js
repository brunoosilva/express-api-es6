const MongoInMemory = require('mongo-in-memory');
const spawn = require('child_process').spawn;
const port = 8000;
const databaseName = 'expressApi';

const mongoServerInstance = new MongoInMemory(port);

mongoServerInstance.start((error, config) => {
    if (error) {
        console.error(error);

        process.exit(1);
    } else {
        console.log(`MongoInMemory started: ${mongoServerInstance.getMongouri(databaseName)}`);

        const fixtures = require('pow-mongodb-fixtures').connect(databaseName, {
            host: config.host,
            port: config.port
        });

        fixtures.load(__dirname + '/mongo_mock/fixtures', () => {
            console.log('Data imported for MongoInMemory');

            const api = spawn('pm2', ['start', 'ecosystem.json', '--env', 'test'], {shell: true, stdio: 'inherit'});

            api.on('close', () => {
                const gulpTest = spawn('gulp', ['test:integration'], {shell: true, stdio: 'inherit'});

                gulpTest.on('close', () => {
                    mongoServerInstance.stop((error) => {
                        if (error) {
                            console.error(`Error stop MongoMemory: ${error}`);
                        } else {
                            console.log('MongoInMemory is finalized');
                        }

                    });

                    const stopApi = spawn('pm2', ['delete', '0'], {shell: true, stdio: 'inherit'});

                    stopApi.on('close', code => {
                        process.exit(code);
                    });
                });
            });
        });
    }
});
