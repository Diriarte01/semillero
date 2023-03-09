/**
 * This function reads a CSV file and returns an array of objects representing the CSV data.
 * @param {string} fileID - The ID of the file to read.
 * @returns {Object[]} An array of objects representing the CSV data.
 */
function readCSVFile(fileID) {
    var file = file.load({
        id: fileID
    });

    var contents = file.getContents();

    var lines = contents.split(/\r\n|\n/);

    var headers = lines[0].split(",");

    var data = [];

    for (var i = 1; i < lines.length; i++) {
        var values = lines[i].split(",");
        var row = {};
        for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }
        data.push(row);
    }

    return data;
}
