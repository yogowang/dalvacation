const mysql = require('mysql2/promise');

async function deleteTableIfExists(connection, tableName) {
  const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\``;
  await connection.query(dropTableQuery);
  console.log(`Table ${tableName} deleted if it existed`);
}

async function createTable(connection, tableName, columns) {
  const createTableQuery = `
    CREATE TABLE \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.map(column => `${column.name} ${column.type} NOT NULL`).join(',\n')}
    );
  `;
  await connection.query(createTableQuery);
  console.log(`Table ${tableName} created`);
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

  if (!tableName || !data) {
    console.log('tableName or data is missing from request body');
    return {
      statusCode: 400,
      body: 'tableName and data are required in the request body'
    };
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.log('Data array is empty or invalid');
    return {
      statusCode: 400,
      body: 'Data array is empty or invalid'
    };
  }

  try {
    const columns = Object.keys(data[0]).map(key => ({
      name: key,
      type: inferColumnType(data[0][key])
    }));

    const connection = await mysql.createConnection({
      host: '34.67.147.89',
      port: 3306,
      user: 'root',
      password: 'lookerstudiodb73',
      database: 'AgentBookings',
      connectTimeout: 960000
    });

    console.log('Connected to MySQL database');

    await deleteTableIfExists(connection, tableName);
    await createTable(connection, tableName, columns);

    const query = `
      INSERT INTO \`${tableName}\` (
        ${columns.map(column => column.name).join(', ')}
      ) VALUES ?`;

    const values = data.map(item => columns.map(column => item[column.name]));

    await connection.query(query, [values]);
    console.log('Data successfully written to MySQL database');

    await connection.end();

    return {
      statusCode: 200,
      body: 'Data successfully written to MySQL database'
    };
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    return {
      statusCode: error.response ? error.response.status : 500,
      body: error.message
    };
  }
};
