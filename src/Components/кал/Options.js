import React from 'react';

const Options = ({ content, onOptionClick }) => {
  return (
    <div className="p-4">
      {content.map((option, index) => (
        <div 
          key={index} 
          className="mb-2 cursor-pointer p-2 text-center bg-gray-100 rounded hover:bg-gray-200" 
          onClick={() => onOptionClick(option)}
        >
          <h3 className="text-lg font-bold">{option.title}</h3>
          <p>{option.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Options;