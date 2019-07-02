/*
 * This module maps the props received from EditorInfo and
 * displays the labels, properties and entity type of the selected node.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import { chip, StyledKeyEditor } from './styled'
import { StyledTable, StyledValue } from '../DatabaseInfo/styled'
import { BinIcon } from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
const createItems = (originalList, RenderType) => {
  let items = [...originalList]

  return items.map((text, index) => {
    return (
      <RenderType.component data-testid='sidebarMetaItem' key={index}>
        {text}
      </RenderType.component>
    )
  })
}
function DisplayNodeDetails (props) {
  let { labels } = props
  let labelItems = <p>There are no labels in database</p>
  if (labels.length) {
    labelItems = createItems(labels, { component: chip })
  }
  let content = <p>There are no properties in database</p>
  const { removeClick } = props
  if (content) {
    content = _.map(props.selectedItem, (value, key) => {
      return (
        <div key={key}>
          <StyledTable>
            <tbody>
              <tr>
                <StyledKeyEditor>{key}:</StyledKeyEditor>
                <StyledValue data-testid='user-details-username'>
                  {getStringValue(value)}
                  <ConfirmationButton
                    requestIcon={<BinIcon />}
                    confirmIcon={<BinIcon deleteAction />}
                    onConfirmed={() => removeClick(key, value)}
                  />
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
        </div>
      )
    })
  }

  return (
    <div>
      <DrawerSection>
        <DrawerSubHeader>Entity</DrawerSubHeader>
        {props.entityType}
      </DrawerSection>
      <DrawerSection>
        <DrawerSubHeader>Labels</DrawerSubHeader>
        <DrawerSectionBody
          className={classNames({
            [styles['wrapper']]: true
          })}
        >
          {labelItems}
        </DrawerSectionBody>
      </DrawerSection>
      <DrawerSection>
        <DrawerSubHeader>Properties</DrawerSubHeader>
        {content}
      </DrawerSection>
    </div>
  )
}

DisplayNodeDetails.propTypes = {
  selectedItem: PropTypes.object
}

export default DisplayNodeDetails
