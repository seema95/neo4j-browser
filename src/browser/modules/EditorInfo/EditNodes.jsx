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
import { FormButton } from 'browser-components/buttons/index'
import { TextInput } from 'browser-components/Form'

export class EditNodes extends Component {
  render () {
    let content = null
    content = _.map(this.props.nodeProperties, (value, key) => {
      return (
        <div key={key}>
          {key}:
          {this.props.toggleEdit ? (
            getStringValue(value)
          ) : (
            <div>
              <TextInput value={getStringValue(value)} />
            </div>
          )}
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
                Properties:
                {content}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                  }}
                >
                  <FormButton
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#9195a0',
                      color: '#30333a'
                    }}
                    onClick={this.props.toggleEditButton}
                  >
                    {this.props.toggleEdit ? 'Edit' : 'Done'}
                  </FormButton>
                  <FormButton
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#9195a0',
                      color: '#30333a'
                    }}
                  >
                    Update
                  </FormButton>
                </div>
              </DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}
