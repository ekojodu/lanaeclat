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
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			// Session expired or signed out — log out cleanly, never get stuck
			if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
				setUser(null);
				setIsAdmin(false);
				setLoading(false);
				return;
			}

			const u = session?.user ?? null;

			if (!u) {
				setUser(null);
				setIsAdmin(false);
				setLoading(false);
				return;
			}

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

		// Safety net — if onAuthStateChange never fires (e.g. network issue),
		// stop loading after 5 seconds and show login page
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 5000);

		return () => {
			subscription.unsubscribe();
			clearTimeout(timeout);
		};
	}, []);

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsAdmin(false);
	};

	return { user, loading, isAdmin, signOut };
}
