import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

const checkWhitelist = async (email: string): Promise<boolean> => {
	const { data } = await supabase
		.from('admin_whitelist')
		.select('email')
		.eq('email', email)
		.maybeSingle();
	return !!data;
};

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		// Listen to auth state — this fires immediately with the current session
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const u = session?.user ?? null;

			if (!u) {
				setUser(null);
				setIsAdmin(false);
				setLoading(false);
				return;
			}

			// Check whitelist
			const allowed = await checkWhitelist(u.email ?? '');

			if (!allowed) {
				await supabase.auth.signOut();
				setUser(null);
				setIsAdmin(false);
			} else {
				setUser(u);
				setIsAdmin(true);
			}

			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsAdmin(false);
	};

	return { user, loading, isAdmin, signOut };
}
