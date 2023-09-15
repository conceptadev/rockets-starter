import { JSONSchema7 } from 'json-schema';
import { UiSchema } from '@rjsf/utils';
import { LiveFormProps } from '../LiveFormProps';
import { mapWidgetType } from './mapWidgetType';

export function uiSchemaGenerator(
  schema: JSONSchema7,
  advancedProperties: LiveFormProps['advancedProperties'],
): Record<string, UiSchema> {
  let uiSchema: Record<string, UiSchema> = {};

  if (schema?.properties && typeof schema.properties === 'object') {
    Object.keys(schema?.properties).forEach(key => {
      const widgetType = mapWidgetType(key, schema, advancedProperties);
      if (widgetType) {
        uiSchema = { ...uiSchema, [key]: { 'ui:widget': widgetType } };
      }
    });
  }

  return uiSchema;
}
