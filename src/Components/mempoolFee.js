import useMempoolInfo from '../Hooks/useMempoolInfo';
import Button from './Button';

function MempoolComponent() {
    const { fees, error, fetchFees } = useMempoolInfo();

    if (error) {
      return <div className="text-xs flex items-center space-x-2">error</div>;
    }
  
    const getFeeValue = (index) => fees && fees[index] ? fees[index] : 0;
    const highFee = Math.round(getFeeValue(1));
    const mediumFee = Math.round((getFeeValue(1) + getFeeValue(2)) / 2);
    const lowFee= Math.round((getFeeValue(2) + getFeeValue(3)) / 2);
  
    return (
      <>
        <Button 
            onClick={fetchFees} 
            title={`${lowFee} / ${mediumFee} / ${highFee}`} 
            className='text-xs'
        />
      </>
    );
  }
  
  export default MempoolComponent;