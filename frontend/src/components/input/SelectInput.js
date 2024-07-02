import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const SelectInput = ({ value, onChange, listName, optionList }) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{listName}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={listName}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
          className="text-left"
        >
          {optionList.map((event) => (
            <MenuItem value={event}>{event.replace("_", " ")}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default SelectInput;
