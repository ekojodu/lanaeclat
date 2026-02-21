import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	const checkAdminStatus = async (u: User | null): Promise<boolean> => {
		if (!u) return false;

		try {
			const { data, error } = await supabase
				.from('admin_whitelist')
				.select('email')
				.eq('email', u.email)
				.maybeSingle(); // won't error if no row found

			if (error) {
				console.error('Whitelist check error:', error.message);
				return false;
			}

			return !!data;
		} catch (err) {
			console.error('Whitelist check failed:', err);
			return false;
		}
	};

	useEffect(() => {
		const init = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const u = session?.user ?? null;
				setUser(u);

				const admin = await checkAdminStatus(u);
				setIsAdmin(admin);

				if (u && !admin) {
					await supabase.auth.signOut();
					setUser(null);
				}
			} catch (err) {
				console.error('Auth init error:', err);
			} finally {
				setLoading(false); // always runs no matter what
			}
		};

		init();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const u = session?.user ?? null;
			setUser(u);

			const admin = await checkAdminStatus(u);
			setIsAdmin(admin);

			if (u && !admin) {
				await supabase.auth.signOut();
				setUser(null);
				setIsAdmin(false);
			}
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
