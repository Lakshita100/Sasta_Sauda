import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { setUserRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUserRole(data.role);
        toast.success(`Welcome back, ${data.name}!`);
        navigate(data.role === 'seller' ? '/seller' : '/marketplace');
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Connection failed. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="w-full max-w-md space-y-0 animate-in fade-in zoom-in-95 duration-500">

        {/* LOGO SECTION */}
        <div className="flex flex-col items-center gap-0">
          <img
            src="logo.png"
            alt="SastaSauda Logo"
            className="h-60 w-auto object-contain"
          />
          {/* <h1 className="text-3xl font-bold text-green-700 tracking-tight">
            SastaSauda
          </h1>
          <p className="text-sm text-green-600">
           
          </p> */}
        </div>

        {/* LOGIN CARD */}
        <Card className="border border-green-200 shadow-2xl rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center text-green-700">
              Sign In
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-4">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 border-green-300 focus-visible:ring-green-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 border-green-300 focus-visible:ring-green-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl py-6"
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate('/register')}
                  className="text-green-700 font-semibold cursor-pointer hover:underline"
                >
                  Register here
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
