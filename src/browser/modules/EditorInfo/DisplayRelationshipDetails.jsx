import React from 'react'
import {
  DrawerSubHeader,
  DrawerSectionBody,
  DrawerSection
} from 'browser-components/drawer/index'
import PropTypes from 'prop-types'
import { PropertiesSection, EntitySection } from './DisplayNodeDetails'
import { StyledRelationship } from '../DatabaseInfo/styled'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
/**
 * Relation ship type section
 * @param {*} props
 */
const RelationShipTypeSection = props => {
  const { relationship } = props
  let relationshipType = (
    <StyledRelationship>{relationship.type}</StyledRelationship>
  )
  return (
    <DrawerSection>
      <DrawerSubHeader>Relationship Type</DrawerSubHeader>
      <DrawerSectionBody
        className={classNames({
          [styles['wrapper']]: true
        })}
      >
        {relationshipType}
      </DrawerSectionBody>
    </DrawerSection>
  )
}

RelationShipTypeSection.propTypes = {
  relationship: PropTypes.object
}

/**
 * Relationship editor
 * @param {*} props
 */
function DisplayRelationshipDetails (props) {
  return (
    <React.Fragment>
      <EntitySection type='Relationship' {...props} />
      <RelationShipTypeSection {...props} />
      <PropertiesSection
        properties={props.relationship ? props.relationship.properties : null}
        {...props}
        entityType='relationship'
        editEntityAction={props.editEntityAction}
      />
    </React.Fragment>
  )
}

DisplayRelationshipDetails.propTypes = {
  relationship: PropTypes.object,
  removeClick: PropTypes.func
}

export default DisplayRelationshipDetails
