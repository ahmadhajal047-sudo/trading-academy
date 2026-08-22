import { createClient } from '@supabase/supabase-js';

// الرابط الصحيح يجب أن يتوقف عند .supabase.co فقط
const supabaseUrl = 'https://rshfjebmkwhpodjjmfiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzaGZqZWJta3docG9kamptZml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDExMDMsImV4cCI6MjEwMjkxNzEwM30.YleAKAxrr38GUthpTGiAjs5m6ONeXi1923Ed9YqB8Yw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);