exports.getSchools = function(req, res) {
    const csvFilePath='./models/schools.csv'
    const csv=require('csvtojson')
    csv({
        delimiter:";",
        includeColumns: /(^|[^A-Za-z])naam($|[^A-Za-z])|(^|[^A-Za-z])gemeente($|[^A-Za-z])/
    })
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        console.log(jsonObj);
        res.send(jsonObj);
    })

};
