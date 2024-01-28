import React from 'react'

const Input = ({inputFor,touched,error,handleChange,values,handleBlur,placeholder}) => {
  return (
    <div className="h-full w-full">
          <label htmlFor={inputFor} className={`text-black block capitalize font-semibold text-sm`}>
            {inputFor}
          </label>
          <input
            className={`bg-inherit h-10 w-full rounded-lg border px-2 py-1 transition duration-300 focus:border-2 active:ring-0 ${
              touched && error
                ? "border-red-500 focus:border-red-500 focus:outline-none"
                : "border-gray-300 focus:border-secondary focus:outline-none"
            } `}
            type={inputFor === "password" || inputFor === "confirmPassword" ? "password" : "text"}
            placeholder={placeholder}
            onChange={handleChange}
            value={values}
            onBlur={handleBlur}
            name={inputFor}
          />
          <p className="text-red-500 ml-1 mt-1 text-sm">
            {touched && error
              ? error
              : ""}
          </p>
        </div>
  )
}

export default Input