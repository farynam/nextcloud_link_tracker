import { Query } from "./query.mjs";
import { objectToString, printObject } from './utils/ObjectUtils.mjs';
import { MailSender } from './mail/mailSender.mjs';
import { Config } from './config.mjs';
import { DBUtils } from './db/dbutils.mjs';
import { Log } from './utils/log.mjs';
import { Constants } from './constants.mjs';
import getDefault from "./utils/langUtils.mjs";


async function queryDatabase(client, domain, query, startFromTs) {
    const result = await DBUtils.executeOnDB(client, query(domain), startFromTs);
    return result;
}

function isEmpty(data) {
    return !(data.calendarShares.length || data.fileShares.length || data.formShares.length);
}

function showConfig(config) {
    console.log(`config:`);
    printObject(config);
}

function showState(state) {
    console.log(`state:`);
    printObject(state);
}


(async () => {
    const dataHome = getDefault(process.env.DATA_HOME, "/myapps/data");
    const configHome = getDefault(process.env.CONFIG_HOME, "/myapps/conf");
    const stateFile = `${dataHome}/state.json`;
    const confFile = `${configHome}/${process.env.CONFIG_FILE}`;

    const config = Config.readConfig(confFile);
    let state = Config.readState(stateFile);

    if (process.env.VERBOSE) {
        showConfig(config);
        showState(state);
    }

    const reportOnly = config.reportOnly;
    const domain = config.domain;
    let startFromTs = state.lastCheck;
    const from = config.email.from;
    const to = config.email.to;
    const subject = config.email.subject;
    const mailHost = config.email.smtp.host;
    const mailHostPort = config.email.smtp.port;
    const mailHostSecure = config.email.smtp.secure;
    const mailHostUser = config.email.smtp.user;
    const mailHostPass = config.email.smtp.password;
    const dbHost = config.db.host;
    const dbHostPort = config.db.port;
    const dbHostUser = config.db.user;
    const dbHostPassword = config.db.password;
    const dbHostDatabse = config.db.database;
    const notificationOn = config.notificationOn;
    
    const log = new Log();

    const client = DBUtils.createClient({
        host: dbHost,
        port: dbHostPort,
        user: dbHostUser,
        password: dbHostPassword,
        database: dbHostDatabse
    });

    const mailSender = new MailSender();
    mailSender.init({
        host: mailHost, // Your SMTP server hostname
        port: mailHostPort, // Typically, 587 for secure SMTP over TLS (recommended)
        secure: mailHostSecure, // false for TLS - as a boolean not string - if true upgrading to TLS
        auth: {
            user: mailHostUser, // Your email address
            pass: mailHostPass, // Your email password or app password for Gmail
        },
    }, log);

    client.connect()
        .then(() => log.info('Connected to the database'))
        .catch(err => log.error('Connection error', err.stack));

    if (reportOnly) {
        startFromTs = new Date(Constants.BEGIN_OF_EPOCH);
    }


    try {
        let calendarShares = [];
        let fileShares = []; 
        let formShares = [];

        if (notificationOn.includes("CALENDAR")) {
            calendarShares = await queryDatabase(client, domain, Query.getCalendarShareQuery, startFromTs);
        }

        if (notificationOn.includes("FILE")) {
            fileShares = await queryDatabase(client, domain, Query.getFileShareQuery, startFromTs);
        }

        if (notificationOn.includes("FORM")) {
            formShares = await queryDatabase(client, domain, Query.getFormQuery, startFromTs);
        }

        const data = {
            calendarShares: calendarShares,
            fileShares: fileShares,
            formShares: formShares
        }

        if (!isEmpty(data)) {
            const notificationText = `Current shares:\n${objectToString(data)}`;
            const mailOptions = {
                from: from,
                to: to, // List of recipients
                subject: subject, // Subject line
                text: `${notificationText}`, // Plain text body
                html: `${notificationText}`, // HTML body (optional)
            };
            await mailSender.sendEmail(mailOptions);

        } else {
            log.info(`Nothing to send`);
        }

        if (!reportOnly) {
            state = Config.saveState(stateFile, log);
            startFromTs = state.lastCheck;
        }

    } catch (err) {
        log.error(`Query error ${err.stack}`);
    } finally {
        await client.end();
    }


})();

