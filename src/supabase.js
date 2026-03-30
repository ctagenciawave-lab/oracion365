import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://dbpsosxfceqhfhwixbjv.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicHNvc3hmY2VxaGZod2l4Ymp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MTAyMTMsImV4cCI6MjA4OTk4NjIxM30.7heyeZszDkJQM5xt-mZPRPzyx3RepxVtV2EBJw2wBy4';

export const supabase = createClient(url, key);
