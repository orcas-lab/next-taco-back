const { createDB } = require('mysql-memory-server');
const { RedisMemoryServer } = require('redis-memory-server');
const { mkdirSync } = require('fs');
async function init() {
    mkdirSync('tmp');
    mkdirSync('public');
    const db = await createDB({
        dbName: 'test',
        version: '8.4.2',
        deleteDBAfterStopped: true,
        username: 'root',
        logLevel: 'LOG',
    });
    const redis = new RedisMemoryServer();
    console.log(`Init database....`);
    console.log(`
DbName: ${db.dbName}
Port: ${db.port}
username: ${db.username}
`);
    console.log('Init Database Success');
    console.log('Init Redis');
    await redis.start();
    console.log(`
Host: ${await redis.getHost()}
Port: ${await redis.getPort()}
Ip: ${await redis.getIp()}
`);
    console.log('Init redis success');
    await db.stop();
    await redis.stop();
}

init().then(() => {});
