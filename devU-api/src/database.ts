import { DataSource, DataSourceOptions } from 'typeorm'

import environment from './environment'

const typeORMConfiguration: DataSourceOptions = {
  type: 'postgres',
  host: environment.dbHost,
  username: environment.dbUsername,
  password: environment.dbPassword,
  database: environment.database,
  port: 5432,
  synchronize: false, // prevents api from auto migrating to match models on startup
  logging: environment.logDB,
  maxQueryExecutionTime: 1000, // logs queries longer than 1 second
  entities: [`${__dirname}/**/*.model.{ts,js}`],
  migrations: [`${__dirname}/migration/**/*.{ts,js}`],
  subscribers: [`${__dirname}/migration/**/*.{ts,js}`],
}

const dataSource = new DataSource(typeORMConfiguration)

export default typeORMConfiguration
export { dataSource }

/*
  This function is used to group the data by the specified column
  @param connection: the specific connection to the database
  @param columnList: the list of columns to be used to group the data
  @param query: the query object
  @param filter: the filter object
  @returns the grouped data
*/
