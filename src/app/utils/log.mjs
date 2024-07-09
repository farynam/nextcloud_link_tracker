export class Log {
    info(msg) {
        console.log(`${new Date()}:${msg}`);
    }

    error(msg) {
        console.error(`${new Date().toISOString()}:${msg}`);
    }
}
