import db from '../src/db/connection';

beforeAll(async () => {
  await db.migrate.latest(); 
});

afterAll(async () => {
  await db.destroy(); 
});
