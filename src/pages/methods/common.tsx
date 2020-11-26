/**
 * this method formats an array of items with an id prop into a comma seperated string of ids.
 * In the event the array is empty, "none" is returned
 * @param {JSON[]} array
 * @returns {string}
 */
export function concatArray(array: JSON[]) {
    let retValue = "";
    if (array == null || array[0] == null) {
        return "none";
    }
    retValue = array[0].id;
    for (let i = 1; i < array.length; i++) {
        retValue += ", ";
        retValue += array[i].id;
    }
    return retValue;
}
