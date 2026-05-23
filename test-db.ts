import { supabase } from './supabase';

export async function testConnection() {
  const { data, error } = await supabase.from('_dummy_table').select('*');
  if (error) {
    console.log('Connection test failed:', error.message);
  } else {
    console.log('Successfully connected to Supabase!', data);
  }
}