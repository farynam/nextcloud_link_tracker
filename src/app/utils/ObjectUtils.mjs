export function countFields(obj) {
    return getFields(obj).length;
}

export function getFields(obj) {
    return Object.keys(obj);
}

export function hasFields(obj) {
    return countFields(obj) > 0;
}

export function arrayIsEmpty(arr) {
    return arr.length == 0;
}

export function objectToString(config) {
    return JSON.stringify(config, null, 2);
}

export function printObject(config) {
    console.log(objectToString(config));
}

export function getObjectValues(obj) {
    return Object.values(obj);
}
