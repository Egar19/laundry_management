import { supabase, supabasee } from '../supabase';

// PENGGUNA START
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('pengguna')
    .select('id_pengguna, nama, email, aktif, peran');

  if (error) throw error;
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

  if (error) throw error;

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

  if (error) throw error;

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

const deleteCustomer = async (id_pelanggan) => {
  const { error } = await supabase
    .from('pelanggan')
    .delete()
    .eq('id_pelanggan', id_pelanggan);

  if (error) throw new Error('Gagal menghapus pelanggan');

  return { success: true };
};

const getCustomerCount = async () => {
  const { count, error } = await supabase
    .from('pelanggan')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;

  return count;
};
// PELANGGAN END

//PENGELUARAN START
const getAllExpense = async ({ page = 1, limit = 5, search = '' }) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from('pengeluaran')
    .select('*', { count: 'exact' })
    .order('tanggal_dibuat', { ascending: false })
    .range(start, end);

  if (search) {
    query = query.or(`deskripsi.ilike.%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return { data, count };
};

const addExpense = async ({ id_pengguna, deskripsi, biaya }) => {
  const { data, error } = await supabase
    .from('pengeluaran')
    .insert([{ id_pengguna, deskripsi, biaya }])
    .select();

  if (error) throw error;

  return data;
};

const updateExpense = async ({ id_pengeluaran, deskripsi, biaya }) => {
  const { data, error } = await supabase
    .from('pengeluaran')
    .update({ deskripsi, biaya })
    .eq('id_pengeluaran', id_pengeluaran)
    .select();

  if (error) throw error;

  return data;
};

const deleteExpense = async (id_pengeluaran) => {
  const { error } = await supabase
    .from('pengeluaran')
    .delete()
    .eq('id_pengeluaran', id_pengeluaran);

  if (error) throw error;
};

const getExpenseCount = async () => {
  const { count, error } = await supabase
    .from('pengeluaran')
    .select('*', { count: 'exact', head: true });

  if(error) throw error;
  return count;
};

const getExpenseMonthlyTotals = async () => {
  const { data, error } = await supabase.rpc('get_expense_totals');

  if (error) throw error;

  return data?.[0] || { this_month: 0, last_month: 0 }; 
};

const getExportExpenses = async (mulai, sampai) => {
  const { data, error } = await supabase.rpc("export_pengeluaran", {
    mulai,
    sampai,
  });

  if (error) throw error;
  return data;
};
//PENGELUARAN END

//TRANSAKSI START
const getAllTransactions = async ({
  page = 1,
  limit = 5,
  search = '',
  status = 'semua',
}) => {
  const skip = (page - 1) * limit;

  const { data, error } = await supabase.rpc('search_transactions', {
    search_term: search,
    status_filter: status,
    take: limit,
    skip,
  });

  if (error) {
    console.error('RPC error:', error);
    throw new Error(error.message || 'Gagal memuat transaksi');
  }

  if (!data) {
    return { data: [], count: 0 };
  }

  const totalCount = data.length > 0 ? data[0].total_count : 0;

  return {
    data,
    count: totalCount,
  };
};

const addTransaction = async ({
  id_pengguna,
  id_pelanggan,
  id_jenis_paket,
  berat_cucian,
  total_biaya,
  status_cucian,
  tanggal_selesai,
}) => {
  const { data, error } = await supabase
    .from('transaksi_cucian')
    .insert([
      {
        id_pengguna,
        id_pelanggan,
        id_jenis_paket,
        berat_cucian,
        total_biaya,
        status_cucian,
        tanggal_selesai,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

const updateTransaction = async ({ id_transaksi, status_cucian, ...rest }) => {
  const shouldSetTanggalSelesai =
    status_cucian === 'selesai, belum diambil' ||
    status_cucian === 'selesai, sudah diambil';

  const { data, error } = await supabase
    .from('transaksi_cucian')
    .update({
      ...rest,
      status_cucian,
      tanggal_selesai: shouldSetTanggalSelesai
        ? new Date().toISOString()
        : null,
    })
    .eq('id_transaksi', id_transaksi)
    .select();

  if (error) throw error;
  return data;
};

const deleteTransaction = async (id_transaksi) => {
  const { error } = await supabase
    .from('transaksi_cucian')
    .delete()
    .eq('id_transaksi', id_transaksi);

  if (error) throw error;
};

const getTransactionCount = async () => {
  const { data, error } = await supabase.rpc('get_transaction_stats');

  if (error) throw error;

  return data[0];
};

const getTransactionMonthlyTotals = async () => {
  const { data, error } = await supabase.rpc('get_transaction_totals');

  if (error) throw error

  return data?.[0] || { this_month: 0, last_month: 0 };
}

const getTransactionByPhoneNumber = async (no_telp) => {
  if (!no_telp) return [];

  const { data: customer, error: custErr } = await supabase
    .from("pelanggan")
    .select("id_pelanggan, nama_pelanggan")
    .eq("no_telp", no_telp)
    .single();

  if (custErr || !customer) return [];

  const { data: transaksi, error: transErr } = await supabase
    .from("transaksi_cucian")
    .select(`
      id_transaksi,
      tanggal_masuk,
      tanggal_selesai,
      status_cucian,
      total_biaya,
      berat_cucian,
      jenis_paket:jenis_paket(id_jenis_paket, nama_paket)
    `)
    .eq("id_pelanggan", customer.id_pelanggan)
    .order("tanggal_masuk", { ascending: false });

  if (transErr) throw transErr;

  return transaksi.map((trx) => ({
    ...trx,
    nama_pelanggan: customer.nama_pelanggan,
  }));
};

const getExportTransactions = async (mulai, sampai) => {
  const { data, error } = await supabase.rpc("export_transaksi", {
    mulai,
    sampai,
  });

  if (error) throw error;
  return data;
};
// TRANSAKSI END

//JENIS PAKET START
const getAllPackages = async () => {
  const { data, error } = await supabase
    .from('jenis_paket')
    .select('*')
    .order('tanggal_dibuat', { ascending: false });

  if (error) throw error;
  return data;
};

const addPackage = async ({
  id_pengguna,
  nama_paket,
  estimasi,
  harga_per_kg,
}) => {
  const { data, error } = await supabase
    .from('jenis_paket')
    .insert([{ id_pengguna, nama_paket, estimasi, harga_per_kg }])
    .select();

  if (error) throw error;
  return data;
};

const updatePackage = async ({
  id_jenis_paket,
  nama_paket,
  estimasi,
  harga_per_kg,
}) => {
  const { data, error } = await supabase
    .from('jenis_paket')
    .update({ nama_paket, estimasi, harga_per_kg })
    .eq('id_jenis_paket', id_jenis_paket)
    .select();

  if (error) throw error;
  return data;
};

const deletePackage = async (id_jenis_paket) => {
  const { error } = await supabase
    .from('jenis_paket')
    .delete()
    .eq('id_jenis_paket', id_jenis_paket);

  if (error) throw error;
};
//JENIS PAKET END

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
  getCustomerCount,
  getTransactionByPhoneNumber,
  getAllExpense,
  getExpenseCount,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseMonthlyTotals,
  getExportExpenses,
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionCount,
  getTransactionMonthlyTotals,
  getExportTransactions,
  getAllPackages,
  addPackage,
  updatePackage,
  deletePackage,
};
