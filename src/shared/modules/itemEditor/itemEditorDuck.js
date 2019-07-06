import { handleCypherCommand } from '../commands/helpers/cypher'
import * as _ from 'lodash'
const initialState = {
  record: undefined,
  entityType: undefined
}
// Action type constants
export const NAME = 'itemEditor'
export const SET_RECORD = `${NAME}/SET_RECORD`
export const FETCH_DATA_ON_SELECT = `${NAME}/FETCH_DATA_ON_SELECT`
export const EDIT_ENTITY_ACTION_CONSTANT = `${NAME}/EDIT_ENTITY_ACTION_CONSTANT`
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
 * Edit Entity action creator
 * @param {int} entityType the selected node id
 * @param {string} firstLabel the label of selected node
 * @param {string} editType edit type (create, update, delete)
 * @param {string} entityType entity type (node, relationship)
 */
export const editEntityAction = (nodeId, firstLabel, editType, entityType) => {
  return {
    type: EDIT_ENTITY_ACTION_CONSTANT,
    nodeId,
    firstLabel,
    editType,
    entityType
  }
}

/**
 * Remove data action creator
 * @param {string/object} propertyKey The propertyKey of selected properties to be removed
 */

export const removeClick = propertyKey => {
  return {
    type: REMOVE_PROPERTY,
    propertyKey
  }
}
/**
 * This function is used to map keys from state and key passed as parameter
 *  if matched then delete properties from redux store
 * @param {object} state
 * @param {string} propertyKey The propertyKey of selected properties to be removed
 */
export const removePropertyByKey = (state, propertyKey) => {
  let propertyState = state.record._fields[0].properties
  let PropertiesKey = _.keys(propertyState)
  _.mapKeys(PropertiesKey, Key => {
    if (Key === propertyKey) {
      delete propertyState[Key]
    }
  })
  return state
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_RECORD:
      return { ...state, record: action.item }
    case FETCH_DATA_ON_SELECT:
      return { ...state, entityType: action.entityType }
    case EDIT_ENTITY_ACTION_CONSTANT:
      return state
    case REMOVE_PROPERTY:
      let removeProperty = _.cloneDeep(state)
      return removePropertyByKey(removeProperty, action.propertyKey)
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
    let cmd = `MATCH (a) where id(a)=${action.id} RETURN a, ((a)-->()) , ((a)<--())`
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

/**
 * Epic to handle edit operation (create, update, delete)
 * This will handle all three edit types viz. create, update, delete (may be by means of switch)
 * every sub operation inturn may handle the case for node and reletionship
 */
export const handleEditEntityEpic = (action$, store) =>
  action$.ofType(EDIT_ENTITY_ACTION_CONSTANT).mergeMap(action => {
    const noop = { type: 'NOOP' }
    let cmd
    switch (action.editType) {
      case 'create':
        break
      case 'update':
        break
      case 'delete':
        if (action.entityType === 'node') {
          cmd = `MATCH (p:${action.firstLabel}) where ID(p)=${action.nodeId} OPTIONAL MATCH (p)-[r]-() DELETE r,p`
        } else if (action.entityType === 'relationship') {
          // FIXME find out the command for relationship deletion
        }
        break
    }
    // Below code will be common to all above kind of operations
    if (cmd) {
      let newAction = _.cloneDeep(action)
      newAction.cmd = cmd
      let [id, request] = handleCypherCommand(newAction, store.dispatch)
      return request
        .then(res => {
          console.log(res)
          store.dispatch({ type: SET_RECORD, item: res.records[0] })
          return noop
        })
        .catch(function (e) {
          throw e
        })
    } else {
      return noop
    }
  })
