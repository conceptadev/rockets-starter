import { JSONSchema7, JSONSchema7Type, JSONSchema7TypeName } from 'json-schema';
import { AdvancedProperty } from '../LiveFormTypes';

export function mapEnumToSchema(
  type: JSONSchema7TypeName,
  enumList: JSONSchema7Type[],
  advancedProperty?: AdvancedProperty,
): JSONSchema7['oneOf'] {
  return enumList.map(enumListItem => {
    const option = advancedProperty?.options?.find(option => {
      if (typeof option === 'object') {
        return option.value === enumListItem;
      } else {
        return enumListItem === option;
      }
    });

    const title: string =
      typeof option === 'object'
        ? option.label
        : option
        ? option
        : typeof enumListItem === 'string'
        ? enumListItem
        : 'NOT A STRING';

    return { type, title, enum: [enumListItem] };
  });
}
