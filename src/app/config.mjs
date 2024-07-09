import { Constants } from "./constants.mjs";
import { readJSON, saveAsJSON } from "./utils/fileUtils.mjs";
import fs from "fs";


export class Config {

    static readConfig(configFile) {
        const rawConfig = readJSON(configFile);

        const configNormalized = Object.assign({}, rawConfig);
    
        configNormalized.reportOnly = configNormalized.reportOnly == undefined ? true : configNormalized.reportOnly;

        return configNormalized;
    }

    static readState(stateFilePath) {
        let lastCheck = Constants.BEGIN_OF_EPOCH;

        if (fs.existsSync(stateFilePath)) {
            const state = readJSON(stateFilePath);    
            lastCheck = state.lastCheck;
        }

        return {
            lastCheck : new Date(lastCheck)
        }
    }
    
    static saveState(stateFilePath, log) {
        const state = {
            lastCheck : new Date().toISOString()
        };

        saveAsJSON(stateFilePath, state, log.info);
        return state;
    }
}