import pg from 'pg';
const { Client } = pg;


export class DBUtils {

    static createClient(config) {
        const client = new Client(config);
        return client;
    }

    static async executeOnDB(client, query, ... params) {
        const data = [];
        const res = await client.query(query, params);
    
        for (let i in res.rows) {
            data.push(Object.assign({}, res.rows[i]));
        }
    
        return data;
    }
}