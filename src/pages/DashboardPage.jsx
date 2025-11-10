import Stat from '../components/Stat';
import { useCustomerCount } from '../hooks/customers/useCustomerCount';
import Loading from '../components/Loading';

const DashboardPage = () => {

  const { data: totalCustomer, isLoading } = useCustomerCount();
  
  return (
    <div className='flex flex-col gap-4'>
      <div className='p-4 bg-base-300 rounded'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
          <Stat
            btnText='Lihat'
            link='/customers'
            title='Total customer'
            value={isLoading ? <Loading /> : totalCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
