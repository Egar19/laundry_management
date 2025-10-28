import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { useGetAllUsers } from '../hooks/users/useGetAllUsers';

const UserList = () => {
  const { data: users, error, isLoading } = useGetAllUsers();

  if (isLoading) return <Loading />;
  if (error) return <Toast message={error.message} variant="error" />;

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Peran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id_pengguna}>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.peran}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
