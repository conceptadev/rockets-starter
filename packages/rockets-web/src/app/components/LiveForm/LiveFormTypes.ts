import { JSONSchema7 } from 'json-schema';
import TypographyProps from '@mui/material/Typography';
import { ButtonProps } from '@mui/material/Button';
import { RJSFSchema } from '@rjsf/utils';

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

export type SchemaProvider = () => Promise<any>;

export type AdvancedPropertiesMapper = (
  schema?: JSONSchema7,
  advancedProperties?: Record<string, AdvancedProperty>,
) => JSONSchema7['properties'];

export type FormLayout = {
  title?: string;
  submitButtonLabel?: string;
  titleTextProps?: typeof TypographyProps;
  submitButtonProps?: ButtonProps;
};
