import Button from '@mui/material/Button';
const SubmitButton = ({ className, buttonName, callButtonFunction }) => {
  return (
    <Button
      variant="contained"
      className={`${className} w-1/2 bg-blue-500 hover:bg-blue-700 text-white py-2`}
      onClick={callButtonFunction}
    >
      {buttonName}
    </Button>
  );
};

export default SubmitButton;
