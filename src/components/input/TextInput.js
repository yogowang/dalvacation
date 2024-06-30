import React from "react";
const TextInput = ({
  className,
  type,
  placeholderText,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col py-2">
      <input
        className={`${className} mb-2 h-12 w-100 rounded-md border-2 border-blue-300 px-2 disabled:border-blue-200`}
        type={type}
        placeholder={placeholderText}
        value={value}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        disabled={disabled}
        min={type === "number" ? 0 : undefined}
      ></input>
    </div>
  );
};

export default TextInput;
