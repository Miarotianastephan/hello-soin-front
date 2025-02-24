import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Composant shadcn UI (assurez-vous que le chemin est correct)
import "../style-soins.css"; // Import du CSS personnalisé

// Section Services
export const Services = () => {
    return (
      <section id="services" className="py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-3xl text-center text-teal-800">Nos Services</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-2xl font-semibold text-teal-600">Yoga</h3>
              <p className="text-gray-600">
                Améliorez votre flexibilité et votre bien-être mental avec nos cours de yoga.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-2xl font-semibold text-teal-600">Méditation</h3>
              <p className="text-gray-600">
                Apprenez à trouver la paix intérieure et à réduire le stress avec la méditation.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-2xl font-semibold text-teal-600">Nutrition</h3>
              <p className="text-gray-600">
                Optimisez votre santé avec des conseils nutritionnels adaptés à vos besoins.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  // Section Contact
export  const Contact = () => {
    return (
      <section id="contact" className="py-20 text-center bg-teal-100">
        <div className="container mx-auto">
          <h2 className="mb-4 text-3xl text-teal-800">Contactez-nous</h2>
          <form action="#" method="POST" className="space-y-6">
            <input type="text" placeholder="Votre nom" className="w-full px-4 py-2 border rounded-md" required />
            <input type="email" placeholder="Votre email" className="w-full px-4 py-2 border rounded-md" required />
            <textarea placeholder="Votre message" className="w-full px-4 py-2 border rounded-md" rows="4" required></textarea>
            <Button type="submit" className="px-6 py-2 text-white bg-teal-600 rounded-full hover:bg-teal-700">
              Envoyer
            </Button>
          </form>
        </div>
      </section>
    );
};
  