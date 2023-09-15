import { FC } from 'react';
import { JSONSchema7 } from 'json-schema';
import { WidgetProps } from '@rjsf/utils';
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
  CustomPasswordFieldWidget,
  CustomCheckboxesWidget,
  CustomRadioWidget,
  CustomSelectWidget,
  CustomCheckboxWidget,
  CustomSwitchWidget,
} from '@concepta/react-material-ui/dist/styles/CustomWidgets';

import { AdvancedProperty } from '../LiveFormTypes';

export function mapWidgetType(
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
