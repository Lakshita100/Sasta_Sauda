import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Phone,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      {/* GAP BELOW NAVBAR */}
      <div className="h-10" />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
            Buy Raw Matrials   
            <br />Ai Verified Products.
          </h1>
          <p className="text-muted-foreground text-lg">
            SastaSauda brings transparency to agricultural markets by showing
            real-time prices and enabling direct trading.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/market-prices")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-xl"
          >
            View Market Prices
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <img
          src="heroimg.png"
          alt="Farmer"
          className="rounded-2xl shadow-lg"
        />
      </section>

       {/* GAP BELOW */}
      <div className="h-10" />

      {/* ================= ABOUT ================= */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-green-800">
            About SastaSauda
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SastaSauda is built to eliminate unfair pricing and middlemen
            exploitation. Farmers can see genuine market prices before selling,
            and buyers get transparent access to quality produce.
          </p>
        </div>
      </section>

       {/* GAP BELOW */}
      <div className="h-10" />

      {/* ================= TEAM ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl font-serif font-bold text-center text-green-800">
            Our Team
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Anand Dangi", "Mahika Chaurasiya", "Ramkumar Chaurasiya" ,"Lakshita Hingar"].map((name, i) => (
              <Card key={i} className="text-center bg-white/80">
                <CardContent className="p-4 space-y-2">
                  <Users className="mx-auto text-green-600 h-8 w-8" />
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">
                   MEMBER
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

   {/* GAP BELOW */}
      <div className="h-10" />

      {/* ================= CONTACT ================= */}
      <section className="bg-green-700 text-green-100 py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="text-green-200">
              Reach out for partnerships, support, or feedback.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> sastasauda86@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 9XXXXXXXXX
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <Linkedin />
              <Twitter />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-green-800 text-green-200 text-center py-4 text-sm">
        © {new Date().getFullYear()} SastaSauda. All rights reserved.
      </footer>
    </div>
  );
}
