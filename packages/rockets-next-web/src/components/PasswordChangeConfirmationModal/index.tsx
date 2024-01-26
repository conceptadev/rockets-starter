import { Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  title?: string;
  subtitle?: string;
  buttonTitle?: string;
  handleClose: () => void;
}

const ConfirmationModal = (props: Props) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
      <Box
        display="flex"
        sx={{
          backgroundColor: "#d1fae5",
          padding: "12px",
          borderRadius: "50%",
          mb: 2,
        }}
      >
        <CheckIcon fontSize="small" />
      </Box>
      <Text fontSize={18} fontWeight={500} color="text.primary">
        {props.title || "Password Changed"}
      </Text>
      <Text
        fontSize={14}
        fontWeight={400}
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {props.subtitle || "Your Password has been changed successfully"}
      </Text>
      <Button variant="contained" onClick={props.handleClose} fullWidth>
        {props.buttonTitle || "Go back to profile"}
      </Button>
    </Box>
  );
};

export default ConfirmationModal;
