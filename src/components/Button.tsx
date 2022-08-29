import React from "react";

interface IButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<IButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="relative inline-block mt-3 text-center group focus:outline-none"
      onClick={onClick}
    >
      <span className="absolute inset-0 transition-transform translate-x-2 translate-y-2 bg-clip bg-[#CB8589] bg-cover group-hover:translate-y-0 group-hover:translate-x-0"></span>
      <span className="relative inline-block px-8 py-3 text-sm font-bold tracking-widest text-white uppercase border-2 border-solid border-white group-active:text-opacity-75">
        {label}
      </span>
    </button>
  );
};

export default Button;
