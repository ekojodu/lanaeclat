import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminAuth.css';

export default function AdminLogin() {
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		if (mode === 'login') {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				setError(error.message);
				setLoading(false);
				return;
			}

			// Check whitelist immediately after login
			const { data: wl } = await supabase
				.from('admin_whitelist')
				.select('email')
				.eq('email', data.user?.email)
				.single();

			if (!wl) {
				await supabase.auth.signOut();
				setError('Access denied. This email is not authorised as an admin.');
			}
		} else {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/admin`,
				},
			});
			if (error) setError(error.message);
			else
				setSuccess(
					'Account created! Check your email to confirm, then log in.',
				);
		}

		setLoading(false);
	};

	const handleGoogle = async () => {
		const { data } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/admin` },
		});
		// Note: Google OAuth redirect — whitelist check happens in useAuth on return
		void data;
	};

	return (
		<div className='auth-page'>
			<div className='auth-card'>
				<div className='auth-brand'>
					<span className='auth-logo'>Lana Éclat</span>
					<span className='auth-subtitle'>Admin Portal</span>
				</div>

				<div className='auth-tabs'>
					<button
						className={mode === 'login' ? 'active' : ''}
						onClick={() => {
							setMode('login');
							setError('');
							setSuccess('');
						}}
					>
						Sign In
					</button>
					<button
						className={mode === 'signup' ? 'active' : ''}
						onClick={() => {
							setMode('signup');
							setError('');
							setSuccess('');
						}}
					>
						Create Account
					</button>
				</div>

				<form onSubmit={handleSubmit} className='auth-form'>
					<div className='form-group'>
						<label>Email Address</label>
						<input
							type='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='admin@email.com'
						/>
					</div>
					<div className='form-group'>
						<label>Password</label>
						<input
							type='password'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='••••••••'
							minLength={6}
						/>
					</div>

					{error && <div className='auth-error'>⚠ {error}</div>}
					{success && <div className='auth-success'>✓ {success}</div>}

					<button type='submit' className='auth-btn-primary' disabled={loading}>
						{loading
							? 'Please wait...'
							: mode === 'login'
								? 'Sign In'
								: 'Create Account'}
					</button>
				</form>

				<div className='auth-divider'>
					<span>or</span>
				</div>

				<button className='auth-btn-google' onClick={handleGoogle}>
					<svg width='18' height='18' viewBox='0 0 24 24'>
						<path
							fill='#4285F4'
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
						/>
						<path
							fill='#34A853'
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
						/>
						<path
							fill='#FBBC05'
							d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
						/>
						<path
							fill='#EA4335'
							d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
						/>
					</svg>
					Continue with Google
				</button>

				<p className='auth-note'>
					Access restricted to authorised studio admins only.
				</p>
			</div>
		</div>
	);
}
