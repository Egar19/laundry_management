import { Link } from 'react-router-dom';

const Stat = ({ title, value, btnText, link }) => {
  return (
    <div className='stats shadow bg-base-100 w-full'>
      <div className='stat'>
        <div className='stat-title'>{title}</div>
        <div className='stat-value'>{value}</div>
        <div className='stat-actions'>
          <Link className='btn btn-xs btn-success' to={link}>
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stat;
