import csv from 'csvtojson';

let exports = {};

exports.getSchools = function(req, res) {
    const csvFilePath='./models/schools.csv'
    csv({
        delimiter:";",
        includeColumns: /(^|[^A-Za-z])naam($|[^A-Za-z])|(^|[^A-Za-z])gemeente($|[^A-Za-z])/
    })
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        //console.log(jsonObj);
        res.send(jsonObj);
    })

};

export default exports;