import React, { FC, Fragment, ReactElement } from 'react';
import useDataProvider, { useQuery } from '@concepta/react-data-provider';
import { Text } from '@concepta/react-material-ui';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/mui';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { LiveFormProps } from './LiveFormProps';

import { RJSFSchema } from '@rjsf/utils';

import { ArrayFieldTemplate } from '@concepta/react-material-ui/dist/styles/CustomWidgets';

import { mapAdvancedProperties } from './lib/mapAdvancedProperties';
import { mergeFormData } from './lib/mergeFormData';
import { uiSchemaGenerator } from './lib/uiSchemaGenerator';

const LiveForm: FC<LiveFormProps> = ({
  // uiSchema,
  formData,
  advancedProperties,
  lfFormKey,
  lfContent,
  lfTitle,
  lfButton,
  lfSchemaProvider = null,
  lfAdvancedPropertiesMapper = mapAdvancedProperties,
  ...props
}) => {
  console.log(lfFormKey);

  const { get } = useDataProvider();

  const getJsonSchema = () => {
    return get({
      uri: `http://localhost:3001/json-schema/testing`,
    });
  };

  const { data } = useQuery(lfSchemaProvider || getJsonSchema, true);

  const finalSchema: RJSFSchema = {
    properties: lfAdvancedPropertiesMapper(data, advancedProperties),
  };

  // const errorMessage: ReactElement = error ? (
  //   <Text>
  //     {typeof error === 'string' ? error : 'Unknown form configuration error'}
  //   </Text>
  // ) : (
  //   <Fragment />
  // );

  const defaultTitle: ReactElement = (
    <Text
      variant="h4"
      fontFamily="Inter"
      fontSize={24}
      fontWeight={800}
      mt={4}
      gutterBottom
    >
      {lfContent?.title || 'Default Title'}
    </Text>
  );

  const defaultButton: ReactElement = (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
      {lfContent?.buttonTitle || 'Submit'}
    </Button>
  );

  return (
    <Fragment>
      {lfTitle ?? defaultTitle}

      {data && (
        <Box>
          {/* {errorMessage ? (
            errorMessage
          ) : ( */}
          <Form
            schema={finalSchema}
            uiSchema={uiSchemaGenerator(finalSchema, advancedProperties)}
            formData={mergeFormData(finalSchema, formData)}
            noHtml5Validate={true}
            showErrorList={false}
            templates={{ ArrayFieldTemplate }}
            validator={validator}
            liveValidate={true}
            {...props}
          >
            {lfButton ?? defaultButton}
          </Form>
          {/* )} */}
        </Box>
      )}
    </Fragment>
  );
};

export default LiveForm;
