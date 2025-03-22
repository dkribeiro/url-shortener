import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: { write: TypeOrmModuleOptions; read: TypeOrmModuleOptions } = {
  write: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
  read: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
};