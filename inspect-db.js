const { Client } = require('pg');
require('dotenv').config();

async function inspectSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_schema AS foreign_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          tc.constraint_name
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND (tc.table_name = 'recipes' OR ccu.table_name = 'recipes');
    `);
    
    console.log('--- RELATIONSHIPS ---');
    res.rows.forEach(r => {
      console.log(`${r.table_name}.${r.column_name} -> ${r.foreign_schema}.${r.foreign_table_name}.${r.foreign_column_name} (${r.constraint_name})`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

inspectSchema();
