import { handleCypherCommand } from '../commands/helpers/cypher'
const initialState = {
  selectedItem: undefined,
  editButtonToggle: true
}

// Action type constants
export const NAME = 'itemEditor'
export const SET_SELECTED_ITEM = `${NAME}/SET_SELECTED_ITEM`
export const FETCH_DATA_ON_SELECT = `${NAME}/FETCH_DATA_ON_SELECT`
export const TOGGLE_EDIT_BUTTON = `${NAME}/TOGGLE_EDIT_BUTTON`
// Actions

export const setSelectedItem = item => {
  return {
    type: SET_SELECTED_ITEM,
    item
  }
}

export const fetchData = (id, entityType) => {
  return {
    type: FETCH_DATA_ON_SELECT,
    id,
    entityType
  }
}

export const toggleEditButton = () => {
  return {
    type: TOGGLE_EDIT_BUTTON
  }
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.item }
    case TOGGLE_EDIT_BUTTON:
      return { ...state, editButtonToggle: !state.editButtonToggle }
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
        store.dispatch({ type: SET_SELECTED_ITEM, item: undefined })
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
          store.dispatch({ type: SET_SELECTED_ITEM, item: res.records[0] })
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
