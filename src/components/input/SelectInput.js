import React from "react";

const SelectInput = ({ value, onChange }) => {
  return (
    <>
      <div className="flex py-2">
        <select
          placeholder="User Type"
          className="h-12 w-full rounded-md border-2 border-blue-300 px-2 disabled:border-blue-200"
          value={value}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
        >
          <option name="ut">User Type</option>
          <option name="customer">User</option>
          <option name="serviceProvider">Event Organizer</option>
        </select>
      </div>
    </>
  );
};

export default SelectInput;
