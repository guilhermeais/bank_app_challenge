import { sequelizeConnection } from './connection';

export function migrate() {
    return sequelizeConnection.sync({ force: true, alter: true });
  }
  