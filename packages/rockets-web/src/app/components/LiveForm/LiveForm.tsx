import React, { FC, Fragment, ReactElement } from 'react';
import useDataProvider, { useQuery } from '@concepta/react-data-provider';
import { Text } from '@concepta/react-material-ui';
import { FormProps } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/mui';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RJSFSchema } from '@rjsf/utils';

export type LiveFormContent = {
  title?: string;
  buttonTitle?: string;
};

export type LiveFormProps = Omit<FormProps, 'schema' | 'validator'> & {
  validator?: FormProps['validator'];
  lfFormKey?: string;
  lfContent?: LiveFormContent;
  lfTitle?: ReactElement;
  lfButton?: ReactElement;
};

const LiveForm: FC<LiveFormProps> = ({
  uiSchema,
  formData,
  lfFormKey,
  lfContent,
  lfTitle,
  lfButton,
  ...props
}) => {
  const { get } = useDataProvider();

  const getJsonSchema = () => {
    return get({
      uri: `/json-schema/${lfFormKey}`,
    });
  };

  const { data, isPending, error } = useQuery(getJsonSchema);

  const errorMessage: ReactElement = error ? (
    <Text>
      {typeof error === 'string' ? error : 'Unknown form configuration error'}
    </Text>
  ) : (
    <Fragment />
  );

  const dataToSchema = (data: RJSFSchema): RJSFSchema => {
    return data;
  };

  const defaultTitle: ReactElement = (
    <Text
      variant="h4"
      fontFamily="Inter"
      fontSize={24}
      fontWeight={800}
      mt={4}
      gutterBottom
    >
      {lfContent?.title ?? 'Default Title'}
    </Text>
  );

  const defaultButton: ReactElement = (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
      {lfContent?.buttonTitle ?? 'Submit'}
    </Button>
  );

  return (
    <Fragment>
      {lfTitle ?? defaultTitle}

      {!isPending && data ? (
        <Box>
          {errorMessage ? (
            errorMessage
          ) : (
            <Form
              schema={dataToSchema(data)}
              uiSchema={uiSchema}
              formData={formData}
              noHtml5Validate={true}
              showErrorList={false}
              validator={validator}
              liveValidate={true}
              {...props}
            >
              {lfButton ?? defaultButton}
            </Form>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default LiveForm;
