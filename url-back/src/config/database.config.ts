import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: {
  write: TypeOrmModuleOptions;
  read: TypeOrmModuleOptions;
} = {
  write: {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/url_shortener',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
  read: {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/url_shortener',
    synchronize: false,
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
};
