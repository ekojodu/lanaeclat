import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	const checkAdminStatus = async (u: User | null) => {
		if (!u) {
			setIsAdmin(false);
			return;
		}

		const { data, error } = await supabase
			.from('admin_whitelist')
			.select('email')
			.eq('email', u.email)
			.single();

		if (error || !data) {
			// Not on the whitelist — sign them out immediately
			await supabase.auth.signOut();
			setUser(null);
			setIsAdmin(false);
		} else {
			setIsAdmin(true);
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			const u = session?.user ?? null;
			setUser(u);
			await checkAdminStatus(u);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const u = session?.user ?? null;
			setUser(u);
			await checkAdminStatus(u);
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
