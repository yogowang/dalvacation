import React from "react";
import TextField from '@mui/material/TextField';

const TextInput = ({
  type,
  placeholderText,
  value,
  onChange,
}) => {
  return (
    <>
      <TextField
        id="outlined-basic"
        label={placeholderText}
        variant="outlined"
        className="w-full"
        value={value}
        type={type}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
      />
    </>
  );
};

export default TextInput;
