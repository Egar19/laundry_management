import StatWrapper from '../components/StatWrapper';

const DashboardPage = () => {
  const statsCucian = [
    {
      title: 'Total Cucian',
      value: 10,
      btnText: 'Lihat',
      link: '/transactions'
    },
    {
      title: 'Cucian Sedang Berlangsung',
      value: 10,
      btnText: 'Lihat',
      link: '/transactions'
    },
    {
      title: 'Cucian Selesai',
      value: 15,
      btnText: 'Lihat',
      link: '/transactions'
    },
  ];
  const statsCustomer = [
    {
      title: 'Total pelanggan',
      value: 10,
      btnText: 'Lihat',
      link: '/customers'
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <StatWrapper statTitle="Cucian" stats={statsCucian} />
      <StatWrapper statTitle="Pelanggan" stats={statsCustomer} />
    </div>
  );
};

export default DashboardPage;