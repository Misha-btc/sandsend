import React, { useState, useEffect } from "react";

export function RangeOutput({ show }) {
  const [sats, setSats] = useState('');
  const [address, setAddress] = useState('');

  const handleSatsChange = (event) => {
    setSats(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <>
      {show && (
        <div className="flex border p-2 rounded-xl divide-y  flex-col">
            <input
              className="text-center"
              type="number"
              placeholder="sats"
              value={sats}
              onChange={handleSatsChange}
            />
            <input
              className="text-center"
              type="text"
              placeholder="address"
              value={address}
              onChange={handleAddressChange}
            />
        </div>
      )}
    </>
  );
}

export default RangeOutput;