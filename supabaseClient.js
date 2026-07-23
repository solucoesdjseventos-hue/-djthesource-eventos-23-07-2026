// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // ou sua URL direta 'https://xxx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // sua chave 'anon public'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
