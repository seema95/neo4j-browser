/*
 * This module depicts the behaviour of the edit drawer that displays the node relationship
 * properties
 */

import React, { Component } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'

import * as _ from 'lodash'
import { getStringValue } from './utils'

export class EditNodes extends Component {
  render () {
    let content = null
    content = _.map(this.props.nodeProperties, (value, key) => {
      return (
        <div key={key}>
          {key}:{getStringValue(value)}
        </div>
      )
    })

    return (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              <DrawerSubHeader>
                properties:
                {content}
              </DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}
