import GithubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';

const Github = () => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="outlined"
      sx={{ mt: 3, textTransform: 'capitalize', borderColor: '#D1D5DB' }}
    >
      <GithubIcon color="action" />
    </Button>
  );
};

export default Github;
