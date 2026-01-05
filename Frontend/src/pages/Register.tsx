import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, ShoppingCart, Lock, Mail, User, ShieldCheck, Wheat } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState<'seller' | 'buyer' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select if you are a Buyer or a Seller");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        setUserRole(data.role);

        toast.success("Account created successfully!");
        navigate(data.role === 'seller' ? '/seller' : '/marketplace');
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="max-w-4xl w-full space-y-4 animate-in fade-in zoom-in-95 duration-500">

        {/* HEADER */}
        <div className="text-center space-y-1">
          {/* <Wheat className="h-10 w-10 text-green-600 mx-auto" /> */}
          
          <div className="flex items-center justify-center">
  <img
    src="logo.png"
    alt="SastaSauda Logo"
    className="h-40 w-auto object-contain"
  />
</div>
          <h1 className="text-3xl font-bold text-green-700 tracking-tight">
            Join SastaSauda
          </h1>
          <p className="text-sm text-green-600">
            AI-verified  trading for everyone
          </p>
        </div>

        <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">

          {/* LEFT: FORM */}
          <Card className="border border-green-200 rounded-2xl shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-green-700">Details</CardTitle>
              <CardDescription>Enter your account information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 border-green-300 focus-visible:ring-green-500"
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 border-green-300 focus-visible:ring-green-500"
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 border-green-300 focus-visible:ring-green-500"
                    required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* RIGHT: ROLE SELECTION */}
          <div className="flex flex-col justify-between gap-4">

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-green-700">
                I want to...
              </Label>

              <div
                onClick={() => setRole('seller')}
                className={`cursor-pointer p-5 rounded-2xl border transition-all
                ${role === 'seller'
                  ? 'border-green-600 bg-green-50'
                  : 'border-green-200 hover:border-green-400'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Store className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-800">Be a Seller</p>
                    <p className="text-xs text-gray-600">
                      List grains and use AI verification
                    </p>
                  </div>
                  {role === 'seller' && <ShieldCheck className="text-green-700" />}
                </div>
              </div>

              <div
                onClick={() => setRole('buyer')}
                className={`cursor-pointer p-5 rounded-2xl border transition-all
                ${role === 'buyer'
                  ? 'border-green-600 bg-green-50'
                  : 'border-green-200 hover:border-green-400'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ShoppingCart className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-800">Be a Buyer</p>
                    <p className="text-xs text-gray-600">
                      Purchase quality-assured grains
                    </p>
                  </div>
                  {role === 'buyer' && <ShieldCheck className="text-green-700" />}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg rounded-xl bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Creating Account..." : "Complete Registration"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate('/login')}
                className="text-green-700 font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
