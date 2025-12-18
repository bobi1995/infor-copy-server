const java = require("java");
const dbConfig = require("../../config/db.config").cloud;

async function fetchQuery(query) {
  let connection;
  try {
    const DriverManager = java.import("java.sql.DriverManager");

    connection = await DriverManager.getConnectionPromise(
      dbConfig.url,
      dbConfig.user,
      dbConfig.password
    );

    const statement = await connection.createStatementPromise();
    const resultSet = await statement.executeQueryPromise(query);
    const meta = await resultSet.getMetaDataPromise();
    const colCount = await meta.getColumnCountPromise();

    const columns = [];
    for (let i = 1; i <= colCount; i++) {
      columns.push(await meta.getColumnNamePromise(i));
    }

    const results = [];
    while (await resultSet.nextPromise()) {
      const row = {};
      for (const col of columns) {
        const val = await resultSet.getObjectPromise(col);
        row[col] = val ? String(val) : null;
      }
      results.push(row);
    }

    return results;
  } catch (err) {
    console.error("Cloud Provider Error:", err);
    throw err;
  } finally {
    if (connection) await connection.closePromise();
  }
}

module.exports = { fetchQuery };
