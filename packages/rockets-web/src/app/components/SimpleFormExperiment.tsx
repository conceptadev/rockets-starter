import React, { FC, Fragment } from 'react';
import { Text } from '@concepta/react-material-ui';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import TypographyProps from '@mui/material/Typography';
import { RJSFSchema, UiSchema, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/mui';
import { FormProps } from '@rjsf/core';
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from 'json-schema';
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
  CustomPasswordFieldWidget,
  CustomCheckboxesWidget,
  CustomRadioWidget,
  CustomSelectWidget,
  CustomCheckboxWidget,
  CustomSwitchWidget,
  ArrayFieldTemplate,
} from '@concepta/react-material-ui/dist/styles/CustomWidgets';

// TEMPORARY FOR REFERENCE ONLY
// export type JSONSchema7TypeName =
//   | 'string' //
//   | 'number'
//   | 'integer'
//   | 'boolean'
//   | 'object'
//   | 'array'
//   | 'null';

type AdvancedFieldTypes =
  | 'string'
  | 'email'
  | 'password'
  | 'array'
  | 'stringArray'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxes'
  | 'switch';

type SelectOption = {
  value: string;
  label: string;
};

type AdvancedOption = SelectOption | string;

export type AdvancedProperty = Pick<JSONSchema7, 'properties'> & {
  type: AdvancedFieldTypes;
  options?: AdvancedOption[];
  advancedProperties?: Record<string, AdvancedProperty>;
};

export type FormLayout = {
  title?: string;
  submitButtonLabel?: string;
  titleTextProps?: typeof TypographyProps;
  submitButtonProps?: ButtonProps;
};

export type SimpleFormProps = Omit<FormProps, 'validator'> & {
  validator?: FormProps['validator'];
  layout?: FormLayout;
  advancedProperties?: Record<string, AdvancedProperty>;
};

function mapWidgetType(
  propertyKey: string,
  schema: JSONSchema7,
  advancedProperties?: Record<string, AdvancedProperty>,
) {
  const widgetTypes: Record<string, FC<WidgetProps>> = {
    // vanilla material works
    string: CustomTextFieldWidget,
    email: CustomEmailFieldWidget,
    password: CustomPasswordFieldWidget,
    select: CustomSelectWidget,
    radio: CustomRadioWidget,
    checkbox: CustomCheckboxWidget,
    checkboxes: CustomCheckboxesWidget,
    // must be custom
    switch: CustomSwitchWidget,
  };

  if (advancedProperties && propertyKey in advancedProperties) {
    return widgetTypes[advancedProperties[propertyKey].type];
  } else {
    return;
  }
}

function mapEnumToSchema(
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

const SimpleFormExperiment: FC<SimpleFormProps> = ({
  schema,
  formData,
  layout,
  advancedProperties,
  ...props
}) => {
  const mergeAdvancedProperties = (
    _schema?: JSONSchema7,
    _advancedProperties?: Record<string, AdvancedProperty>,
  ): JSONSchema7['properties'] => {
    const propertiesToReturn: JSONSchema7['properties'] = {
      ..._schema?.properties,
    };

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

    if (propertiesToReturn && typeof propertiesToReturn === 'object') {
      Object.keys(propertiesToReturn).forEach((key: string) => {
        let propertyToReturn: JSONSchema7Definition;
        let advancedProperty: AdvancedProperty;

        if (propertiesToReturn && propertiesToReturn[key] !== false) {
          propertyToReturn = propertiesToReturn[key];
        } else {
          return;
        }

        if (_advancedProperties && key in _advancedProperties) {
          advancedProperty = _advancedProperties[key];
        } else {
          return;
        }

        const fieldType: JSONSchema7TypeName =
          fieldTypesMap[advancedProperty.type];

        if (fieldType && typeof propertyToReturn === 'object') {
          propertyToReturn.type = fieldType;

          if (
            advancedProperty.options &&
            advancedProperty.type === 'checkboxes'
          ) {
            propertyToReturn['items'] = {
              type: 'string',
              enum: advancedProperty.options,
            };

            propertyToReturn['uniqueItems'] = true;
          }

          if (
            propertyToReturn?.enum &&
            ['select', 'radio'].includes(advancedProperty.type)
          ) {
            propertyToReturn.oneOf = mapEnumToSchema(
              propertyToReturn.type,
              propertyToReturn.enum,
              advancedProperty,
            );
          }

          if (advancedProperty.type === 'stringArray') {
            propertyToReturn['items'] = {
              type: 'string',
              title: propertyToReturn.title,
            };
          }

          if (
            advancedProperty.type === 'array' &&
            advancedProperty.properties
          ) {
            propertyToReturn['items'] = {
              type: 'object',
              properties: mergeAdvancedProperties(
                advancedProperty.properties,
                advancedProperty.advancedProperties,
              ),
            };
          }
        }

        propertiesToReturn[key] = propertyToReturn;
      });

      return propertiesToReturn;
    }
  };

  const finalSchema: RJSFSchema = {
    ...schema,
    properties: mergeAdvancedProperties(schema, advancedProperties),
  };

  const generateUiSchema: () => Record<string, UiSchema> = () => {
    const uiSchema: Record<string, UiSchema> = {};

    if (schema?.properties && typeof schema.properties === 'object') {
      Object.keys(schema?.properties).forEach(key => {
        const widgetType = mapWidgetType(key, schema, advancedProperties);
        if (widgetType) {
          uiSchema[key]['ui:widget'] = widgetType;
        }
      });
    }

    return uiSchema;
  };

  const mergeFormData = () => {
    if (schema?.properties && typeof schema.properties === 'object') {
      const mergedFormData: Record<string, any> = {
        ...formData,
      };

      Object.keys(schema?.properties).map(key => {
        const property = schema?.properties && schema.properties[key];
        if (
          property &&
          property !== true &&
          property.type !== undefined &&
          !Array.isArray(property.type) &&
          ['stringArray', 'array'].includes(property.type)
        ) {
          mergedFormData[key] = mergedFormData?.[key] || [''];
        }
      });

      if (Object.keys(mergedFormData).length) {
        return mergedFormData;
      }
    }

    return null;
  };

  return (
    <Fragment>
      {layout?.title && (
        <Text
          variant="h4"
          fontFamily="Inter"
          fontSize={24}
          fontWeight={800}
          mt={4}
          gutterBottom
          {...layout?.titleTextProps}
        >
          {layout.title}
        </Text>
      )}

      <Box>
        <Form
          schema={finalSchema}
          uiSchema={generateUiSchema()}
          formData={mergeFormData()}
          noHtml5Validate={true}
          showErrorList={false}
          templates={{ ArrayFieldTemplate }}
          validator={validator}
          liveValidate={true}
          {...props}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            {...layout?.submitButtonProps}
          >
            {layout?.submitButtonLabel || 'Submit'}
          </Button>
        </Form>
      </Box>
    </Fragment>
  );
};

export default SimpleFormExperiment;
