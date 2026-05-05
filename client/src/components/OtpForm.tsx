import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Mail } from 'lucide-react';

interface OtpFormProps {
    email: string;
    onVerified?: () => void;
}

const OtpForm = ({ email, onVerified }: OtpFormProps) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [cooldown, setCooldown] = useState(30);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { confirmOtp, resendOtp } = useAuth();
    const navigate = useNavigate();

    // tick down cooldown each second
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    const onInput = (idx: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const updated = [...otp];
        updated[idx] = val.slice(-1);
        setOtp(updated);
        if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    };

    const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            otpRefs.current[idx - 1]?.focus();
        }
    };

    const onPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const updated = otp.map((_, i) => text[i] || '');
        setOtp(updated);
        otpRefs.current[Math.min(text.length, 5)]?.focus();
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError('Please enter all 6 digits');
            return;
        }
        setError('');
        setVerifying(true);
        try {
            await confirmOtp(email, code);
            setVerified(true);
            onVerified?.();
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Invalid code, try again');
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            await resendOtp(email);
            setCooldown(30);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Could not resend code');
        }
    };

    return (
        <>
            <div className="mb-6 text-center">
                <Mail className='text-green-700 mx-auto mb-4' size={40} />
                <h1 className="text-2xl font-semibold text-gray-800">Verify your email</h1>
                <p className="text-sm text-gray-500 mt-1">
                    We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                    {error}
                </div>
            )}

            {verified && (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-5">
                    Email verified! Redirecting to login...
                </div>
            )}

            <form onSubmit={handleVerify}>
                <div className="flex justify-center gap-2.5 mb-6" onPaste={onPaste}>
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => onInput(i, e.target.value)}
                            onKeyDown={e => onKeyDown(i, e)}
                            disabled={verified}
                            className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={verifying || verified}
                    className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                    {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-500">
                Didn't receive the code?{' '}
                {cooldown > 0 ? (
                    <span className="text-gray-400">Resend in {cooldown}s</span>
                ) : (
                    <button onClick={handleResend} className="text-green-700 hover:underline font-medium">
                        Resend code
                    </button>
                )}
            </div>
        </>
    );
};

export default OtpForm;
