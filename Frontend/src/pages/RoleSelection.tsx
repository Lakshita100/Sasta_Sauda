import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Wheat } from 'lucide-react';
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
        
        // Auto-redirect based on saved role
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <Wheat className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold tracking-tight">SastaSauda</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" type="email" placeholder="name@example.com" className="pl-10" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" type="password" className="pl-10" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full text-lg" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account? <span onClick={() => navigate('/register')} className="text-primary cursor-pointer font-bold hover:underline">Register here</span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}