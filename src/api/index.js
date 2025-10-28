import supabase from '../supabase';

const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('pengguna')
    .select('id_pengguna, nama, email, peran');

  if (error) throw new Error(error.message);
  return data;
};

const addUser = async (newUser) => {
  const { data, error } = await supabase
  .from('pengguna')
  .insert([newUser])
  .select();
  if (error) throw new Error(error.message);
  return data[0]
}



const loginUser = async ({ email, password }) => {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

const logOutUser = async () => {
  const { error } = supabase.auth.signOut();
  if (error) {
    console.log('gagal logout')
  } else {
    console.log('berhasil logout');
  }
}

const authUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data;
};

const getCurrentUser = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Gagal ambil user:', userError.message);
    return null;
  }

  const { data: pengguna, error } = await supabase
    .from('pengguna')
    .select('id_pengguna, nama, email, peran')
    .eq('id_pengguna', user.id)
    .single();

  if (error) {
    console.error('Gagal ambil data pengguna:', error.message);
    return null;
  }

  console.log('Data pengguna login:', pengguna);
  return pengguna;
};

export { getAllUsers, loginUser, logOutUser, authUser, getCurrentUser, addUser };