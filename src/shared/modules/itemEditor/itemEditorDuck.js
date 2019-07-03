import { handleCypherCommand } from '../commands/helpers/cypher'
const initialState = {
  record: undefined,
  entityType: undefined
}

// Action type constants
export const NAME = 'itemEditor'
export const SET_RECORD = `${NAME}/SET_RECORD`
export const FETCH_DATA_ON_SELECT = `${NAME}/FETCH_DATA_ON_SELECT`
export const REMOVE_PROPERTY = `${NAME}/REMOVE_PROPERTY`

// Actions

/**
 * Fetch data action creator
 * @param {number} id The id of selected entity for which we will fetch data
 * @param {string} entityType the selected entity type
 */
export const fetchData = (id, entityType) => {
  return {
    type: FETCH_DATA_ON_SELECT,
    id,
    entityType
  }
}

/**
 * Remove data action creator
 * @param {string/object} propertyKey The propertyKey of selected properties to be removed
 * @param {string} propertyValue The propertyValue of the selected properties to be removed
 */

export const removeClick = (propertyKey, propertyValue) => {
  return {
    type: REMOVE_PROPERTY,
    propertyKey,
    propertyValue
  }
}
// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_RECORD:
      return { ...state, record: action.item }
    case FETCH_DATA_ON_SELECT:
      return { ...state, entityType: action.entityType }
    case REMOVE_PROPERTY:
      console.log(action.propertyKey, action.propertyValue)
      return state

    default:
      return state
  }
}

/**
 * Epic to fetch data on selecting the node/relationship from database
 */
export const handleFetchDataEpic = (action$, store) =>
  action$.ofType(FETCH_DATA_ON_SELECT).mergeMap(action => {
    const noop = { type: 'NOOP' }
    if (!action.id) {
      return Promise.resolve().then(() => {
        store.dispatch({ type: SET_RECORD, item: undefined })
        return noop
      })
    }
    let cmd = `MATCH (a) where id(a)=${
      action.id
    } RETURN a, ((a)-->()) , ((a)<--())`
    if (action.entityType === 'relationship') {
      cmd = `MATCH ()-[r]->() where id(r)=${action.id} RETURN r`
    }
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records && res.records.length) {
          store.dispatch({ type: SET_RECORD, item: res.records[0] })
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
