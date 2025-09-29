const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const sql = fs.readFileSync('db/schema.sql', 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('DB schema applied.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
