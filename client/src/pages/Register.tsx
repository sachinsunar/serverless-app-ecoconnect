import { useState } from 'react';
import Stepper from '../components/Stepper';
import RegisterForm from '../components/RegisterForm';
import OtpForm from '../components/OtpForm';

export default function Register() {
    const [step, setStep] = useState('register');
    const [email, setEmail] = useState('');

    // called by RegisterForm once signup succeeds
    const handleRegistered = (userEmail: string) => {
        setEmail(userEmail);
        setStep('otp');
    };

    return (
        <div className="min-h-[calc(100vh-13.8vh)] bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <Stepper step={step} />

                {step === 'register' && <RegisterForm onSuccess={handleRegistered} />}
                {step === 'otp' && <OtpForm email={email} />}
            </div>
        </div>
    );
}