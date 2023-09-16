let infoController = new Object();
let dbController = require('../db/dbController')
const appHelper = require('../helper/appHelper')
async function filterObjectKeys(obj) {
    const allowedKeys = ["limit","sku","location","region_code","serviceName","serviceCode"];
    const filteredObject = {};
    
    for (const key in obj) {
      if (allowedKeys.includes(key)) {
        filteredObject[key] = obj[key];
      }
    }
    
    return filteredObject;
}

async function getSearchQuery(filteredObject){
    return new Promise((resolve, reject) => {
        let searchQuery = '';
        for (const [key, value] of Object.entries(filteredObject)) {
            if (value && key !== 'limit') {
                if (searchQuery === '') {
                    searchQuery = searchQuery.concat(`${key} in ("${value}")`);
                }else {
                    searchQuery = searchQuery.concat(` AND ${key} in ("${value}")`);
                }
            }
        }
        resolve(searchQuery);
    });
}
infoController.getServiceinfo =async (req)=>{
    try{
        let inputData = req.query;
        console.log(inputData);
        let limit = 1000;
        if(inputData.limit){
            limit = inputData.limit;
        }
        const filteredObject = await filterObjectKeys(inputData);
        console.log(filteredObject);
        let searchQuery=await getSearchQuery(filteredObject);
        console.log(searchQuery);
        let dbResults = await dbController.getData(searchQuery,limit);
        if (!dbResults.status){
            return appHelper.apiResponse(500, false, dbResults.message);
        }
        return appHelper.apiResponse(200, true, 'Retrieved all Data', dbResults);
    }catch (error){
        console.log('Error:', error);
        return appHelper.apiResponse(500, false, error.message ? error.message : error);
    }
}

module.exports = infoController;