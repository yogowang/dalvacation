import Button from '@mui/material/Button';
const SubmitButton = ({ buttonName, callButtonFunction }) => {
  return (
    <Button
      variant="contained"
      className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white py-2"
      onClick={callButtonFunction}
    >
      {buttonName}
    </Button>

    // <button
    //   className={`${className} my-2 text-1xl z-5 w-1/2 rounded-lg bg-blue-500 px-8 py-2 text-white shadow-md hover:bg-blue-950 disabled:bg-blue-400`}
    //   onClick={callButtonFunction}
    // >
    //   {buttonName}
    // </button>
  );
};

export default SubmitButton;
