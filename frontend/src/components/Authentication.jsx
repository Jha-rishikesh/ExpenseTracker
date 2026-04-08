import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Authentication = () => {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isLogin) {
            await login(username, password);
        } else {
            const success = await register(username, password);
            if (success) setIsLogin(true); // Switch to login after signup
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e2f] px-6">
            <div className="bg-[#27293d] p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {isLogin ? "Welcome Back! 👋" : "Create Account 🚀"}
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-[#1e1e2f] border border-[#3b3d54] rounded-lg text-white outline-none focus:border-[#00f2c3] transition"
                            placeholder="Enter username..." 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 bg-[#1e1e2f] border border-[#3b3d54] rounded-lg text-white outline-none focus:border-[#00f2c3] transition"
                            placeholder="Enter password..." 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full p-3 mt-2 rounded-lg font-bold text-lg transition-transform hover:scale-[1.02] ${
                            isLogin ? 'bg-[#1d8cf8] text-white hover:bg-blue-600' : 'bg-[#e14eca] text-white hover:bg-pink-600'
                        } ${loading ? 'opacity-70 saturate-50' : ''}`}
                    >
                        {loading ? 'Wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button 
                        type="button" 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-[#9a9afb] hover:text-white transition-colors"
                    >
                        {isLogin ? "Naye ho? Account banao" : "Pehle se account hai? Login karo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
