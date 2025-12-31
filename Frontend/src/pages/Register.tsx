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
  
  // Form State
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <Wheat className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-4xl font-serif font-bold">Join SastaSauda</h1>
          <p className="text-muted-foreground">AI-verified agricultural trading for everyone</p>
        </div>

        <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Enter your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" placeholder="John Doe" className="pl-10" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" type="email" placeholder="name@example.com" className="pl-10" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" type="password" className="pl-10" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Role Selection */}
          <div className="flex flex-col gap-4 justify-between">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">I want to...</Label>
              
              <div 
                onClick={() => setRole('seller')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${role === 'seller' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg"><Store className="text-primary h-6 w-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold">Be a Seller</p>
                    <p className="text-xs text-muted-foreground">List grains and use AI verification</p>
                  </div>
                  {role === 'seller' && <ShieldCheck className="text-primary" />}
                </div>
              </div>

              <div 
                onClick={() => setRole('buyer')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${role === 'buyer' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg"><ShoppingCart className="text-accent-foreground h-6 w-6" /></div>
                  <div className="flex-1">
                    <p className="font-bold">Be a Buyer</p>
                    <p className="text-xs text-muted-foreground">Purchase quality-assured grains</p>
                  </div>
                  {role === 'buyer' && <ShieldCheck className="text-accent-foreground" />}
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full py-6 text-lg" disabled={loading}>
              {loading ? "Creating Account..." : "Complete Registration"}
            </Button>
            <p className="text-center text-sm">
              Already have an account? <span onClick={() => navigate('/login')} className="text-primary cursor-pointer font-bold hover:underline">Sign In</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}