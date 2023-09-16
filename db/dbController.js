const mysql = require('mysql2');
let dbController = new Object();
let appHelper = require('../helper/appHelper');
// Create a MySQL connection pool for better resource management
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the connection limit as needed
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// Function to insert data into the MySQL table
dbController.insertData = function insertData(data) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error acquiring connection from the pool: ' + err);
        return reject(err);
      }

      // Begin a transaction
      connection.beginTransaction(async (err) => {
        if (err) {
          console.error('Error beginning transaction: ' + err);
          connection.release();
          return reject(err);
        }

        try {
          // Define the data to be inserted
          const query = 'INSERT INTO aws_service_pricing SET ?';

          // Execute the query with the data
          const results = await executeQuery(connection, query, data);

          // Commit the transaction if the insert is successful
          await commitTransaction(connection);

          // Release the connection
          connection.release();

          resolve(results);
        } catch (err) {
          // Rollback the transaction if an error occurs
          await rollbackTransaction(connection);

          // Release the connection
          connection.release();

          reject(err);
        }
      });
    });
  });
}

// Function to retrieve data from the MySQL table
dbController.getData = function getData(searchQuery,limit) {
    return new Promise((resolve, reject) => {
      // Define the SELECT query
      console.log(searchQuery)
      const query = `WITH A As (SELECT 
                                    service_type,
                                    metadata.sku,
                                    rateCode,
                                    description,
                                    beginRange,
                                    endRange,
                                    unit,
                                    pricePerUnit,
                                    effectiveDate,
                                    location,
                                    serviceName,
                                    serviceCode,
                                    usageType,
                                    region_code
                                FROM AWS_SERVICES.aws_services_pricing AS pricing
                                INNER JOIN AWS_SERVICES.aws_services_metadata AS metadata
                                ON pricing.sku = metadata.sku)
                    Select DISTINCT service_type,
                                    sku,
                                    rateCode,
                                    description,
                                    beginRange,
                                    endRange,
                                    unit,
                                    pricePerUnit,
                                    effectiveDate,
                                    location,
                                    serviceName,
                                    serviceCode,
                                    usageType,
                                    region_code
                     from A where ${searchQuery} LIMIT ${Number(limit)};
        `;
  
      // Get a connection from the pool
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error acquiring connection from the pool: ' + err.message);
          reject(err);
          return appHelper.apiResponse(500,false,'Error acquiring connection from the pool '+err.message);
        }
  
        // Execute the SELECT query
        connection.query(query, (err, results) => {
          // Release the connection back to the pool
          connection.release();
  
          if (err) {
            console.error('Error executing SELECT query: ' + err);
            reject(err.message);
            return appHelper.apiResponse(500,false,'Error acquiring connection from the pool '+err.message);
          }
  
        // Resolve with the results
        resolve(appHelper.apiResponse(200,true,'Data Retrieved Successfully',results));

        });
      });
    });
}

// Function to execute a query and return a Promise
function executeQuery(connection, query, data) {
  return new Promise((resolve, reject) => {
    connection.query(query, data, (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to commit a transaction and return a Promise
function commitTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        console.error('Error committing transaction: ' + err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Function to rollback a transaction and return a Promise
function rollbackTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      console.error('Transaction rolled back.');
      resolve();
    });
  });
};

module.exports = dbController;