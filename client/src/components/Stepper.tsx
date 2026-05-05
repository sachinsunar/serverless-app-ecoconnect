
const Stepper = ({ step }: { step: string }) => {
    return (
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step === 'register' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-700'
                    }`}>
                    {step === 'otp' ? '✓' : '1'}
                </div>
                <span className={`text-sm font-medium ${step === 'register' ? 'text-gray-800' : 'text-green-700'}`}>
                    Register
                </span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300 rounded" />

            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step === 'otp' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                    2
                </div>
                <span className={`text-sm font-medium ${step === 'otp' ? 'text-gray-800' : 'text-gray-400'}`}>
                    Verify
                </span>
            </div>
        </div>
    )
}

export default Stepper