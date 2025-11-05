import { supabase, supabasee } from '../supabase';

// PENGGUNA START
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('pengguna')
    .select('id_pengguna, nama, email, aktif, peran');

  if (error) throw new Error(error.message);
  return data;
};

const addUser = async ({ email, password, nama, peran }) => {
  if (!email || !password || !nama || !peran) {
    throw new Error('Semua field wajib diisi.');
  }

  const { data: existingUser, error: existingError } = await supabase
    .from('pengguna')
    .select('id_pengguna')
    .eq('email', email)
    .maybeSingle();

  if (existingError)
    throw new Error('Gagal memeriksa email di tabel pengguna.');
  if (existingUser) throw new Error('Email sudah terdaftar di tabel pengguna.');

  const { data: authListData, error: authListError } =
    await supabasee.auth.admin.listUsers();

  if (authListError) throw new Error('Gagal memeriksa email di Supabase Auth.');

  const emailExistsInAuth = authListData.users.some((u) => u.email === email);
  if (emailExistsInAuth)
    throw new Error('Email sudah terdaftar di Supabase Auth.');

  const { data: authData, error: authError } =
    await supabasee.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nama, peran },
    });
  if (authError) throw new Error(authError.message);

  const { error: penggunaError } = await supabase
    .from('pengguna')
    .upsert({
      id_pengguna: authData.user.id,
      nama,
      email,
      peran,
      aktif: true,
    })
    .select()
    .single();

  if (penggunaError) throw new Error('Gagal menambahkan data pengguna.');

  return authData.user;
};

const updateUser = async (id_pengguna, { nama, peran }) => {
  const { data, error } = await supabase
    .from('pengguna')
    .update({ nama, peran })
    .eq('id_pengguna', id_pengguna)
    .select()
    .single();

  if (error) throw new Error('Gagal mengubah data pegguna');

  return data;
};

const toggleDeactivateUser = async (id_pengguna) => {
  const { data: user, error: fetchError } = await supabase
    .from('pengguna')
    .select('aktif')
    .eq('id_pengguna', id_pengguna)
    .single();

  if (fetchError) throw new Error('Gagal mengambil status pengguna.');

  const { data, error } = await supabase
    .from('pengguna')
    .update({ aktif: !user.aktif })
    .eq('id_pengguna', id_pengguna)
    .select()
    .single();

  if (error) throw new Error('Gagal memperbarui status pengguna.');

  return data;
};
//PENGGUNA END

// AUTH START
const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error('Email atau kata sandi salah');

  const user = data.user;
  if (!user) throw new Error('User tidak ditemukan');

  const { data: pengguna, error: penggunaError } = await supabase
    .from('pengguna')
    .select('aktif')
    .eq('id_pengguna', user.id)
    .maybeSingle();

  if (penggunaError) throw new Error('Gagal memeriksa status pengguna.');

  if (!pengguna) {
    throw new Error('Data pengguna belum lengkap. Hubungi admin.');
  }

  if (!pengguna.aktif) {
    await supabase.auth.signOut();
    throw new Error('Akun Anda telah dinonaktifkan. Hubungi admin.');
  }

  return user;
};

const logOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log('gagal logout');
  } else {
    console.log('berhasil logout');
  }
};

const authUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data;
};

const getCurrentUser = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error('Gagal ambil user:', userError.message);
    return null;
  }

  const { data: pengguna, error } = await supabase
    .from('pengguna')
    .select('id_pengguna, nama, email, aktif, peran')
    .eq('id_pengguna', user.id)
    .single();

  if (error) {
    console.error('Gagal ambil data pengguna:', error.message);
    return null;
  }

  if (!pengguna.aktif) {
    await supabase.auth.signOut();
    throw new Error('Akun Anda telah dinonaktifkan. Hubungi admin.');
  }

  console.log('Data pengguna login:', pengguna);
  return pengguna;
};
// AUTH END

// PELANGGAN START
const getAllCustomer = async ({ page = 1, limit = 5, search = '' }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('pelanggan')
    .select('*', { count: 'exact' })
    .order('tanggal_dibuat', { ascending: false });

  if (search) {
    query = query.or(
      `nama_pelanggan.ilike.%${search}%,alamat.ilike.%${search}%,no_telp.ilike.%${search}%`
    );
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, count };
};

const addCustomer = async ({
  id_pengguna,
  nama_pelanggan,
  no_telp,
  alamat,
}) => {
  const { data, error } = await supabase
    .from('pelanggan')
    .insert([{ id_pengguna, nama_pelanggan, no_telp, alamat }])
    .select()
    .single();

  if (error) throw new Error('Gagal menambahkan data pelanggan');

  return data;
};

const updateCustomer = async ({
  id_pelanggan,
  nama_pelanggan,
  no_telp,
  alamat,
}) => {
  const { data, error } = await supabase
    .from('pelanggan')
    .update({ nama_pelanggan, no_telp, alamat })
    .eq('id_pelanggan', id_pelanggan)
    .select()
    .single();

  if (error) throw new Error('Gagal memperbarui data pelanggan');

  return data;
};

const deleteCustomer = async ( id_pelanggan ) => {
  const { error } = await supabase
    .from('pelanggan')
    .delete()
    .eq('id_pelanggan', id_pelanggan);

  if (error) throw new Error('Gagal menghapus pelanggan');

  return { success: true };
};
// PELANGGAN END

export {
  getAllUsers,
  addUser,
  updateUser,
  toggleDeactivateUser,
  loginUser,
  logOutUser,
  authUser,
  getCurrentUser,
  getAllCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
