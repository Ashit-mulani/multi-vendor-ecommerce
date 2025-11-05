import React from "react";
import { Input } from "./input";
import { BiImageAdd } from "react-icons/bi";

const CInput = ({
  className = "",
  label = "name",
  id = "name",
  type = "text",
  placeholder = "Enter here . . . ",
  accept,
  profile,
  file,
  error,
  ...rest
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-1">
      <label className="text-xs font-semibold ml-1" htmlFor={id}>
        {label}
      </label>
      <Input
        name={id}
        accept={accept}
        className={`${
          profile && "hidden"
        } border placeholder:text-xs font-medium ${className}`}
        id={id}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
      {profile && (
        <label
          className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-md cursor-pointer border border-zinc-500/20 shadow-xs group hover:bg-blue-500/10 hover:border-blue-500/20 smooth"
          htmlFor={id}
        >
          {file ? (
            <img className="h-full w-full object-cover" src={file} />
          ) : (
            <BiImageAdd
              size={30}
              className="group-hover:scale-105 smooth text-zinc-500 group-hover:text-blue-500"
            />
          )}
        </label>
      )}
      {error && (
        <span className="text-xs font-medium ml-1 text-red-500">{error}</span>
      )}
    </div>
  );
};

export default CInput;
