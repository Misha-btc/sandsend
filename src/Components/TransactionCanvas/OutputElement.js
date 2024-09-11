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
        className="absolute -top-3 -left-2 font-bold text-2xl text-white hover:text-gray-400"
      />
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null) ? (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="confirm"
          onClick={handleConfirm}
        />
      ) : (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="edit"
          onClick={handleEdit}
        />
      )}
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null) ? (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
            address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={handleAddressUpdate}
            className="w-full text-center rounded-md bg-zinc-900 text-white p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.addressError && (
            <div className="text-red-500 text-xs mt-1">{errors.addressError}</div>
          )}
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            amount
          </label>
          <div className="flex items-center">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountUpdate}
              className="w-3/4 text-center rounded-md bg-zinc-900 text-white p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              className="rounded-md bg-zinc-600 text-white p-1 hover:bg-zinc-700 ml-2 shadow-md focus:outline-none"
              value={coinFormat}
              onChange={handleFormatChange}
            >
              <option value="sats">sats</option>
            </select>
          </div>
          {errors.amountError && (
            <div className="text-red-500 text-xs mt-1">{errors.amountError}</div>
          )}
          <div className="mt-2 flex justify-between flex-row">
            <Button
              title="max"
              className="w-full hover:text-green-500 text-gray-500"
              onClick={handleMaxAmount}
            />
          </div>
        </div>
      ) : (
        <div className="pt-3 pb-2">
          <p className="text-green-500 mb-2">address: {output.address.slice(0, 3)}...{output.address.slice(-5)}</p>
          <p className="text-white">
            amount: {output.amount} {output.satsFormat}
          </p>
        </div>
      )}
    </>
  );
};

export default OutputElement;
