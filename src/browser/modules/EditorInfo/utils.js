/**
 * Given the neo4j property data type, transform the property value to string form.
 * @param value
 * Neo4j property value with valid property data type
 * @return {string} String representation of neo4j property value if valid data type, else empty string
 */
import { v1 as neo4j } from 'neo4j-driver'
export const getStringValue = value => {
  if (neo4j.isInt(value)) {
    return value.toInt()
  }
  if (neo4j.isPoint(value)) {
    return value.toString()
  }
  if (neo4j.isDate(value)) {
    return value.toString()
  }
  if (neo4j.isTime(value)) {
    return value.toString()
  }
  if (neo4j.isLocalTime(value)) {
    return value.toString()
  }
  if (neo4j.isLocalDateTime(value)) {
    return value.toString()
  }
  if (neo4j.isDuration(value)) {
    return value.toString()
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (Array.isArray(value)) {
    return value.join(' , ')
  }

  return ''
}
