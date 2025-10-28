import Stat from './Stat';

const StatWrapper = ({ statTitle, stats = [] }) => {
  return (
    <div className='p-4 bg-base-300 rounded'>
      <h1 className='text-2xl font-bold mb-4'>{statTitle}</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        {stats.map((stat, index) => (
          <Stat
            key={index}
            title={stat.title}
            value={stat.value}
            btnText={stat.btnText}
            link={stat.link}
          />
        ))}
      </div>
    </div>
  );
};

export default StatWrapper;
