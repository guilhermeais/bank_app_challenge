import { sequelizeConnection } from './connection'

export function truncate() {
  return Promise.all(
    Object.keys(sequelizeConnection.models).map((key) => {
      return sequelizeConnection.models[key].destroy({
        truncate: true,
        force: true,
      })
    })
  )
}