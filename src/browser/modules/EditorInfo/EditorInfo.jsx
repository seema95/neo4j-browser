import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import DisplayNodeDetails from './DisplayNodeDetails'
import DisplayRelationshipDetails from './DisplayRelationshipDetails'
import {
  Drawer,
  DrawerHeader,
  DrawerBody
} from 'browser-components/drawer/index'
import { getSelectedItem } from 'shared/modules/selectors/itemEditor'
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'

/**
 * The Editor drawer.
 * Based on selection, either provides node editor or relationship editor.
 * If nothing is selected then it prompts to do so.
 */
export class EditorInfo extends Component {
  render () {
    return (
      <div>
        <Drawer>
          <DrawerHeader>Editor</DrawerHeader>
          <DrawerBody>
            {this.props.selectedItem ? (
              this.props.entityType === 'node' ? (
                <DisplayNodeDetails
                  editEntityAction={this.props.editEntityAction}
                  node={this.props.selectedItem}
                />
              ) : (
                <DisplayRelationshipDetails
                  relationship={this.props.selectedItem}
                  editEntityAction={this.props.editEntityAction}
                />
              )
            ) : null}
          </DrawerBody>
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: getSelectedItem(state),
    entityType: state.itemEditor.entityType
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editEntityAction: (
      nodeId,
      firstLabel,
      propertyKey,
      editType,
      entityType
    ) => {
      const action = itemEditorActions.editEntityAction(
        nodeId,
        firstLabel,
        propertyKey,
        editType,
        entityType
      )
      ownProps.bus.send(action.type, action)
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
