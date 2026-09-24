import { createClient } from '@/utils/supabase/client'; // sesuaikan path client supabase kamu

const supabase = createClient();

// Fetcher reusable untuk SWR
export const supabaseFetcher = async ([table, selectQuery, filterColumn, filterValue]: [string, string, string?, any?]) => {
  let query = supabase.from(table).select(selectQuery);
  
  if (filterColumn && filterValue !== undefined) {
    query = query.eq(filterColumn, filterValue);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};