const mysql = require('mysql2/promise');

async function deleteTableIfExists(connection, tableName) {
  const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\``;
  await connection.query(dropTableQuery);
  console.log(`Table ${tableName} deleted if it existed`);
}

async function createTable(connection, tableName, columns) {
  if (columns.length === 0) {
    throw new Error('Cannot create table with no columns');
  }

  const createTableQuery = `
    CREATE TABLE \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.map(column => `${column.name} ${column.type} NOT NULL`).join(',\n')}
    );
  `;
  await connection.query(createTableQuery);
  console.log(`Table ${tableName} created`);
}

async function clearTable(connection, tableName) {
  const clearTableQuery = `DELETE FROM \`${tableName}\``;
  await connection.query(clearTableQuery);
  console.log(`Table ${tableName} cleared`);
}

function inferColumnType(value) {
  if (typeof value === 'number') {
    return 'DECIMAL(10, 2)';
  } else if (typeof value === 'boolean') {
    return 'BOOLEAN';
  } else {
    return 'VARCHAR(255)';
  }
}

exports.handler = async (event) => {
  console.log('Function callAWSLambdaAndStoreInMySQL invoked');

  const { tableName, data } = event;
  console.log(`Received tableName: ${tableName}, data: ${JSON.stringify(data)}`);

  if (!tableName) {
    console.log('tableName is missing from request body');
    return {
      statusCode: 400,
      body: 'tableName is required in the request body'
    };
  }

  // Check if data is provided and is valid
  const dataArray = Array.isArray(data) ? data : [data];
  console.log(`Normalized dataArray: ${JSON.stringify(dataArray)}`);

  try {
    const connection = await mysql.createConnection({
      host: '34.67.147.89',
      port: 3306,
      user: 'root',
      password: 'lookerstudiodb73',
      database: 'AgentBookings',
      connectTimeout: 960000
    });

    console.log('Connected to MySQL database');

    if (dataArray.length === 0 || (dataArray.length === 1 && Object.keys(dataArray[0]).length === 0)) {
      // If data is empty, clear the table
      await clearTable(connection, tableName);
      console.log('No data provided, table cleared');
    } else {
      // Determine columns based on the first item in the array
      const columns = Object.keys(dataArray[0]).map(key => ({
        name: key,
        type: inferColumnType(dataArray[0][key])
      }));
      console.log(`Columns: ${JSON.stringify(columns)}`);

      await deleteTableIfExists(connection, tableName);
      await createTable(connection, tableName, columns);

      const query = `
        INSERT INTO \`${tableName}\` (
          ${columns.map(column => column.name).join(', ')}
        ) VALUES ?`;

      const values = dataArray.map(item => columns.map(column => item[column.name]));
      console.log(`Values: ${JSON.stringify(values)}`);

      await connection.query(query, [values]);
      console.log('Data successfully written to MySQL database');
    }

    await connection.end();

    return {
      statusCode: 200,
      body: 'Data successfully processed'
    };
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};
