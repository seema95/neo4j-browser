/*
 * This module depicts the behaviour of the edit drawer.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import { EditNodes } from './EditNodes'
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'
export class EditorInfo extends Component {
  render () {
    return (
      <div>
        <EditNodes
          nodeProperties={this.props.selectedItem._fields[0].properties}
          toggleEditButton={this.props.toggleEditButton}
          toggleEdit={this.props.toggleEdit}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    selectedItem: state.itemEditor.selectedItem,
    toggleEdit: state.itemEditor.editButtonToggle
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleEditButton: () => {
      dispatch(itemEditorActions.toggleEditButton())
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
