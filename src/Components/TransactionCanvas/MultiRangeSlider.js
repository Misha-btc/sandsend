import React from "react";

const MultiRangeSlider = ({ min, max, onChange }) => {
/*   const [sliderValues, setSliderValues] = useState([min, ...points, max]); */

  return (
    <>
      <input
        className="w-2/3"
        type="range"
        min="0"
        max="1000"
      />
    </>
  );
};

export default MultiRangeSlider;