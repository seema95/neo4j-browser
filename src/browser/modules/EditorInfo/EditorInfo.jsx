/*
 * This module depicts the behaviour of the edit drawer and
 * it imports DisplayNodeDetails which is used for rendering
 * selected node's properties.
 * Also,it imports DisplayRelationshipDetails which is used for rendering
 * selected relationship's properties.
 */

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
import * as itemEditor from 'shared/modules/itemEditor/itemEditorDuck'
export class EditorInfo extends Component {
  render () {
    return (
      <div>
        <Drawer>
          <DrawerHeader>Editor</DrawerHeader>
          <DrawerBody>
            {this.props.selectedItem !== undefined ? (
              this.props.entityType == 'node' ? (
                <DisplayNodeDetails
                  selectedItem={this.props.selectedItem._fields[0].properties}
                  entityType={this.props.entityType}
                  labels={this.props.selectedItem._fields[0].labels}
                  removeClick={this.props.removeClick}
                />
              ) : (
                <div>
                  <DisplayRelationshipDetails
                    relationshipType={this.props.selectedItem._fields[0].type}
                    relationshipProperties={
                      this.props.selectedItem._fields[0].properties
                    }
                    entityType={this.props.entityType}
                  />
                </div>
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
    selectedItem: state.itemEditor.selectedItem,
    entityType: state.itemEditor.entityType
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    removeClick: (propertykey, propertyvalue) => {
      const action = itemEditor.removeClick(propertykey, propertyvalue)
      dispatch(action)
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
