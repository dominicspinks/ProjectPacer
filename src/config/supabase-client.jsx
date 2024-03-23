import { createClient } from '@supabase/supabase-js';

// Load supabase credentials from the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
	realtime: {
		params: {
			eventsPerSecond: 10,
		},
	},
});
