const { createDB } = require('mysql-memory-server');
const { RedisMemoryServer } = require('redis-memory-server');
async function setup(){
    const db = await createDB({
        dbName: 'test',
        version: '8.4.2',
        deleteDBAfterStopped: true,
        username: 'root',
        logLevel: 'LOG',
    });
    const redis = new RedisMemoryServer();
}

setup()
.then(()=>{})