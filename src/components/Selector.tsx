import React, { useState, useRef } from "react";
import { useClickAway } from "../lib/hooks";

function Selector({
  value,
  onSelect,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  placeholder: string;
  onSelect: (value: string) => void;
  options: string[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close selector on click outside of the component
  useClickAway(selectRef, () => {
    setIsOpen(false);
  });

  // Handle selection of an option and close the selector on select
  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={"relative w-full " + className}>
      <div
        className={
          "border rounded-lg shadow-sm bg-white cursor-pointer p-2 flex justify-between items-center transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white" +
          (isOpen ? " border-black" : " border-gray-300 dark:border-gray-600")
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value ? value : placeholder}
        </span>
        <img
          className={`w-2 h-2 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          src="/images/arrow.svg"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg shadow-lg bg-white">
          <ul className="max-h-[20vh] md:max-h-[25vh] overflow-auto rounded-lg">
            {options.map((option) => (
              <li
                key={option}
                className="p-2 cursor-pointer transition-all hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Selector;
