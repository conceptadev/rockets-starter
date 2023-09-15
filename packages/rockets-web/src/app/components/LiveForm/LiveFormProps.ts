import { ReactElement } from 'react';
import { FormProps } from '@rjsf/core';
import { LiveFormContent } from './interfaces/LiveFormContent';
import {
  AdvancedPropertiesMapper,
  AdvancedProperty,
  SchemaProvider,
} from './LiveFormTypes';

export type LiveFormProps = Omit<FormProps, 'schema' | 'validator'> & {
  validator?: FormProps['validator'];
  advancedProperties?: Record<string, AdvancedProperty>;
  lfFormKey?: string;
  lfContent?: LiveFormContent;
  lfTitle?: ReactElement;
  lfButton?: ReactElement;
  lfSchemaProvider?: SchemaProvider;
  lfAdvancedPropertiesMapper?: AdvancedPropertiesMapper;
};
