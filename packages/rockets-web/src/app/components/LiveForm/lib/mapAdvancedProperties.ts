import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from 'json-schema';

import { AdvancedProperty } from '../LiveFormTypes';
import { mapEnumToSchema } from './mapEnumToSchema';

export function mapAdvancedProperties(
  _schema?: JSONSchema7,
  _advancedProperties?: Record<string, AdvancedProperty>,
): JSONSchema7['properties'] {
  const propertiesToReturn: JSONSchema7['properties'] = {};

  const fieldTypesMap: Record<string, JSONSchema7TypeName> = {
    string: 'string',
    email: 'string',
    password: 'string',
    array: 'array',
    stringArray: 'array',
    select: 'string',
    radio: 'string',
    checkbox: 'boolean',
    checkboxes: 'array',
    switch: 'boolean',
  };

  if (_schema?.properties && typeof _schema.properties === 'object') {
    Object.keys(_schema?.properties).forEach((propertyKey: string) => {
      let schemaProperty: JSONSchema7Definition;
      let advancedProperty: AdvancedProperty;
      let propertyToReturn: JSONSchema7Definition = {};

      if (_schema?.properties && _schema.properties[propertyKey] !== false) {
        schemaProperty = _schema.properties[propertyKey];
        if (typeof schemaProperty === 'object') {
          propertyToReturn = { ...schemaProperty };
        } else {
          return;
        }
      } else {
        return;
      }

      if (_advancedProperties && propertyKey in _advancedProperties) {
        advancedProperty = _advancedProperties[propertyKey];
      } else {
        propertiesToReturn[propertyKey] = schemaProperty;
        return;
      }

      const fieldType: JSONSchema7TypeName =
        fieldTypesMap[advancedProperty?.type];

      if (fieldType && typeof schemaProperty === 'object') {
        propertyToReturn.type = fieldType;

        if (advancedProperty.type === 'checkboxes') {
          if (advancedProperty.options) {
            propertyToReturn['items'] = {
              type: 'string',
              enum: advancedProperty.options,
            };
          } else {
            propertyToReturn['items'] = {
              type: 'string',
              enum: schemaProperty?.enum,
            };
          }
          delete propertyToReturn.enum;
          propertyToReturn['uniqueItems'] = true;
        }

        if (
          schemaProperty?.enum &&
          ['select', 'radio'].includes(advancedProperty.type)
        ) {
          propertyToReturn.oneOf = mapEnumToSchema(
            fieldType,
            schemaProperty.enum,
            advancedProperty,
          );
          delete propertyToReturn.enum;
        } else if (propertyToReturn?.enum) {
          propertyToReturn.anyOf = mapEnumToSchema(
            fieldType,
            propertyToReturn.enum,
            advancedProperty,
          );
          delete propertyToReturn.enum;
        }

        if (advancedProperty.type === 'stringArray') {
          propertyToReturn['items'] = {
            type: 'string',
            title: schemaProperty.title,
          };
        }

        if (advancedProperty.type === 'array' && advancedProperty.properties) {
          propertyToReturn['items'] = {
            type: 'object',
            properties: mapAdvancedProperties(
              advancedProperty.properties,
              advancedProperty.advancedProperties,
            ),
          };
        }
      }

      propertiesToReturn[propertyKey] = propertyToReturn;
    });

    console.log(propertiesToReturn);
    return propertiesToReturn;
  }
}
