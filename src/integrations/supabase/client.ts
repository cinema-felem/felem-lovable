// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://veankxkxdvyrqxvhndew.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYW5reGt4ZHZ5cnF4dmhuZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTc0NTIsImV4cCI6MjA1OTUzMzQ1Mn0._OKjvra14QAPuRXKWbRpIqn1ZbIjAr9qnOgk7_BKfJE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);