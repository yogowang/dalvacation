const SubmitButton = ({ className, buttonName, callButtonFunction }) => {
  return (
    <button
      className={`${className} my-2 text-1xl z-5 w-full rounded-lg bg-blue-500 px-8 py-2 text-white shadow-md hover:bg-blue-950 disabled:bg-blue-400`}
      onClick={callButtonFunction}
    >
      {buttonName}
    </button>
  );
};

export default SubmitButton;
