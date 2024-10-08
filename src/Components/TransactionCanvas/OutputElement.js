import Button from '../Button';

const OutputElement = ({
   output,
   indexEdit,
   handleRemoveOutput,
   address,
   amount,
   errors,
   coinFormat,
   handleConfirm,
   handleEdit,
   handleFormatChange,
   handleAddressUpdate,
   handleAmountUpdate,
   handleMaxAmount,
 }) => {

  return (
    <>
      <Button
        title="x"
        onClick={handleRemoveOutput}
        className="absolute -top-3 -left-2 font-bold text-xl text-white hover:text-gray-400"
      />
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null) ? (
        <Button
          className="absolute top-0 right-1 text-gray-500 hover:text-green-500 text-lg"
          title="✓"
          onClick={handleConfirm}
        />
      ) : (
        <Button
          className="absolute top-0 right-1 text-gray-500 hover:text-white text-lg"
          title="✎"
          onClick={handleEdit}
        />
      )}
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null) ? (
        <div className="flex flex-col h-full justify-between">
          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-400 mb-1">
              address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={handleAddressUpdate}
              className="w-full text-center rounded-md bg-zinc-900 text-white p-1 text-xs mb-1 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.addressError && (
              <div className="text-red-500 text-xs">{errors.addressError}</div>
            )}
          </div>
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1">
              amount
            </label>
            <div className="flex items-center">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountUpdate}
                className="w-2/3 text-center rounded-md bg-zinc-900 text-white p-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <select
                className="rounded-md bg-zinc-600 text-white p-1 text-xs hover:bg-zinc-700 ml-1 shadow-md focus:outline-none"
                value={coinFormat}
                onChange={handleFormatChange}
              >
                <option value="sats">sats</option>
              </select>
            </div>
            {errors.amountError && (
              <div className="text-red-500 text-xs">{errors.amountError}</div>
            )}
          </div>
          <Button
            title="max"
            className="w-full hover:text-green-500 text-gray-500 text-xs"
            onClick={handleMaxAmount}
          />
        </div>
      ) : (
        <div className="flex flex-col h-full justify-center text-center">
          <p className="text-green-500 text-sm mb-2">{output.address.slice(0, 5)}...{output.address.slice(-7)}</p>
          <p className="text-white text-sm">
            {output.amount} {output.satsFormat}
          </p>
        </div>
      )}
    </>
  );
};

export default OutputElement;
