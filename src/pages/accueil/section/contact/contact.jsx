import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="px-6 py-12 bg-green-50">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#0f2b3d]">Contactez-nous</h2>
        <p className="mt-2 text-[#0f2b3d]">Nous sommes à votre écoute pour toute question.</p>
      </div>
      <div className="grid max-w-4xl gap-8 mx-auto md:grid-cols-2">
        {/* Formulaire de contact */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input placeholder="Votre nom" className="border-[#0f2b3d]" />
            <Input type="email" placeholder="Votre email" className="border-[#0f2b3d]-300" />
            <Textarea placeholder="Votre message" className="border-[#0f2b3d]" />
            <Button className="w-full text-white bg-[#0f2b3d] hover:bg-green-800">Envoyer</Button>
          </CardContent>
        </Card>
        
        {/* Informations de contact */}
        <Card className="flex flex-col items-center justify-center p-6 space-y-4 text-center bg-green-100">
          <div className="flex items-center space-x-3">
            <Mail className="text-[#0f2b3d]" />
            <span>contact@medecine-traditionnelle.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="text-[#0f2b3d]" />
            <span>+33 1 23 45 67 89</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="text-[#0f2b3d]" />
            <span>123 Rue des Plantes, Paris, France</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
