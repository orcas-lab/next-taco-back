import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { randomUUID } from 'crypto';

export const setupDataSource = async (entities: any[]) => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: randomUUID,
      impure: true,
    });
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
  });
  await ds.initialize();
  await ds.synchronize();

  return ds;
};
