import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): {
  write: TypeOrmModuleOptions;
  read: TypeOrmModuleOptions;
} => {
  const defaultUrl = `postgresql://postgres:postgres@postgres:5432/url_shortener`;
  return {
    write: {
      type: 'postgres',
      url: process.env.DATABASE_URL || defaultUrl,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    },
    read: {
      type: 'postgres',
      url: process.env.DATABASE_URL || defaultUrl,
      synchronize: false,
      logging: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    },
  };
};
