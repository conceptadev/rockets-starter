// Concepta Components
import { FormTemplate, Image } from '@concepta/react-material-ui';
// import { SimpleForm } from '@concepta/react-material-ui';

// Content
import content from 'app/content/content';
import schema from 'app/forms/CompleteProfile';

// Project Components

// Assets
import logo from 'app/assets/images/logo.svg';
import SimpleFormExperiment from '../../components/SimpleFormExperiment';

const CompleteProfile = () => {
  return (
    <>
      <FormTemplate
        title={content.completeProfile.title}
        subtitle={content.completeProfile.subTitle}
        icon={<Image src={logo} alt="Logo" />}
      >
        <SimpleFormExperiment schema={schema} />
      </FormTemplate>
    </>
  );
};

export default CompleteProfile;
