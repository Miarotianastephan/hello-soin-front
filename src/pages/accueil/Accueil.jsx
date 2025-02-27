// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./style-soins.css";
import logo from "./image/hs.svg";
import background from "./image/pratique fond.png";
import { Services, Contact } from "./section/section";
import { UserCheck, LogIn, BetweenHorizonalEnd, Menu, X } from "lucide-react";
import { Locate, UserCircle, ArrowDownLeftFromCircle } from "lucide-react";
import MedicalGrid from "./section/medicalGrid/medicalgrid";
import ContactSection from "./section/contact/contact";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Fausses données de médecins avec URL d'image réelles
const fakeDoctors = [
  {
    id: 1,
    name: "Dupont",
    firstName: "Jean",
    specialty: "Cardiologue",
    address: "123 Rue de Paris, 75001 Paris, France",
    gps: { lat: 48.8566, lng: 2.3522 },
    photo: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 2,
    name: "Martin",
    firstName: "Marie",
    specialty: "Dermatologue",
    address: "456 Rue de Lyon, 69001 Lyon, France",
    gps: { lat: 45.764, lng: 4.8357 },
    photo: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: 3,
    name: "Bernard",
    firstName: "Luc",
    specialty: "Généraliste",
    address: "789 Rue de Marseille, 13001 Marseille, France",
    gps: { lat: 43.2965, lng: 5.3698 },
    photo: "https://randomuser.me/api/portraits/men/30.jpg",
  },
];

/* ================================
   Composant Google Maps
================================ */
const MapComponent = ({ searchResults }) => {
  // État local pour ajouter les marqueurs de façon séquentielle
  const [displayedMarkers, setDisplayedMarkers] = useState([]);
  const mapRef = useRef(null);

  // Ajout séquentiel des marqueurs à chaque changement de résultats
  useEffect(() => {
    setDisplayedMarkers([]); // Réinitialisation
    searchResults.forEach((doctor, index) => {
      setTimeout(() => {
        setDisplayedMarkers((prev) => [...prev, doctor]);
      }, index * 200); // Délai de 200ms entre chaque ajout
    });
  }, [searchResults]);

  // Ajustement des limites de la carte lorsque les marqueurs sont mis à jour
  useEffect(() => {
    if (mapRef.current && displayedMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      displayedMarkers.forEach((doctor) => {
        bounds.extend({ lat: doctor.gps.lat, lng: doctor.gps.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [displayedMarkers]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // Centre initial de la carte
  const center = { lat: 46.603354, lng: 1.888334 };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCVV3ppmh4H7Su1ZGAiu29Cj9fYiEem5ug">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={(map) => (mapRef.current = map)}
      >
        {displayedMarkers.map((doctor) => (
          <Marker
            key={doctor.id}
            position={{ lat: doctor.gps.lat, lng: doctor.gps.lng }}
            title={`${doctor.firstName} ${doctor.name} - ${doctor.specialty}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

/* ================================
   Composants Header, SearchForm, Hero, SearchResultsLayout, Footer
================================ */
const Header = () => {
  const [headerBg, setHeaderBg] = useState("bg-transparent");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderBg(window.scrollY > 50 ? "bg-custom-bg" : "bg-transparent");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        transition: "top 5s ease-in-out",
      }}
      id="header"
      className={`${headerBg} fixed w-full top-0 left-0 z-50 transition-all duration-300 text-white accueil-header-animation`}
    >
      <div className="container flex items-center justify-between h-20 mx-auto ">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <nav className="justify-start hidden space-x-6 md:flex">
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Accueil
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Services
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Contact
          </Button>
        </nav>
        <div className="hidden space-x-4 md:flex">
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#2b7a72] text-sm">
            <LogIn /> Se connecter
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#2b7a72] text-sm">
            <BetweenHorizonalEnd /> S'inscrire
          </Button>
          <Link to="/login">
            <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#2b7a72] text-sm">
              <UserCheck /> Êtes-vous praticien ?
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#2b7a72] absolute top-20 left-0 w-full flex flex-col items-center py-4 space-y-4">
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Accueil
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Services
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white bg-transparent border-none shadow-none">
            Contact
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#1e5e56] text-sm">
            <LogIn /> Se connecter
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#1e5e56] text-sm">
            <BetweenHorizonalEnd /> S'inscrire
          </Button>
          <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  text-white border-none shadow-none bg-[#1e5e56] text-sm">
            <UserCheck /> Êtes-vous praticien ?
          </Button>
        </div>
      )}
    </header>
  );
};

const SearchForm = ({ onSearch }) => {
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(specialty, location);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full gap-4 px-4 py-2 bg-white border-2 rounded-md"
    >
      <div className="flex items-center pr-4 border-r">
        <UserCircle className="text-gray-400" />
        <Input
          id="specialty"
          type="text"
          placeholder="Rechercher par spécialité"
          className="ml-2 border-none placeholder:text-gray-400"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
      </div>
      <div className="flex items-center pr-4 border-r">
        <Locate className="text-gray-400" />
        <Input
          id="location"
          type="text"
          placeholder="Localisation"
          className="ml-2 border-none placeholder:text-gray-400"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" className="w-full bg-[#2b7a72]">
          Recherche
        </Button>
      </div>
    </form>
  );
};

const Hero = ({ onSearch }) => {
  return (
    <section id="accueil" className="relative h-screen bg-custom-bg py-50">
      <div className="absolute inset-0 bg-custom-bg"></div>
      {/* L'image de fond est masquée sur mobile et tablette */}
      <div className="absolute hidden md:block right">
        <img
          src={background}
          alt="Pratique fond"
          className="h-screen bg-right"
        />
      </div>
      <div className="container relative flex flex-col items-center justify-center h-screen pt-10 mx-auto md:items-start">
        <h1 className="w-full mb-4 text-5xl font-bold text-center text-white md:w-2/4 md:text-start">
          Votre rendez-vous Bien-être
        </h1>
        <h6 className="w-full text-2xl text-center text-white md:w-2/4 md:text-start">
          Professionnels vérifiés &amp; certifiés de la santé au rendez-vous
          pour votre bien-être
        </h6>
        <div className="mt-20 w-full md:w-[60%]">
          <SearchForm onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
};

const SearchResultsLayout = ({ searchResults, onSearch, onReset }) => {
  const [isMapDialogOpen, setMapDialogOpen] = useState(false);

  return (
    <div className="relative h-screen gap-8 px-20 pt-20 mx-auto bg-custom-bg">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Colonne gauche : formulaire et résultats */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-row items-center justify-between gap-6">
            <Button onClick={onReset} className="bg-[#2b7a72]">
              <ArrowDownLeftFromCircle />
            </Button>
            <SearchForm onSearch={onSearch} />
          </div>
          <div className="mt-4 space-y-4">
            {searchResults.map((doctor) => (
              <div
                key={doctor.id}
                className="flex flex-col items-center p-4 bg-white border rounded-lg shadow md:flex-row"
              >
                <img
                  src={doctor.photo}
                  alt={`${doctor.firstName} ${doctor.name}`}
                  className="w-16 h-16 mb-2 mr-0 rounded-full md:mr-4 md:mb-0"
                />
                <div className="flex-grow">
                  <p className="font-bold">
                    {doctor.firstName} {doctor.name}
                  </p>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <p className="text-gray-600">{doctor.address}</p>
                </div>
                <Button className="transition-colors duration-300 ease-in-out hover:bg-helloSoin  mt-2 md:mt-0 text-white bg-[#2b7a72]">
                  Consulter
                </Button>
              </div>
            ))}
          </div>
          {/* Bouton Show Map visible uniquement sur mobile et tablette */}
          <div className="mt-4 md:hidden">
            <Button
              onClick={() => setMapDialogOpen(true)}
              className="w-full text-white bg-[#2b7a72]"
            >
              Afficher Map
            </Button>
          </div>
        </div>
        {/* Affichage de la carte en colonne droite sur desktop */}
        <div className="hidden w-1/2 md:block" style={{ height: "24rem" }}>
          <MapComponent searchResults={searchResults} />
        </div>
      </div>

      {/* Dialog pour afficher la carte sur mobile et tablette */}
      {isMapDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-11/12 p-4 bg-white rounded-lg h-3/4">
            <Button
              onClick={() => setMapDialogOpen(false)}
              className="absolute text-white bg-red-500 top-2 right-2"
            >
              Fermer
            </Button>
            <div className="w-full h-full p-10">
              <MapComponent searchResults={searchResults} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const Footer = () => {
  return (
    <footer className="py-6 text-center text-white bg-[#0f2b3d]">
      <p>&copy; 2025 Bien-être &amp; Harmonie. Tous droits réservés.</p>
    </footer>
  );
};

/* ================================
   Composant principal Accueil
================================ */
const Accueil = () => {
  const [searchResults, setSearchResults] = useState([]);

  const onReset = () => {
    setSearchResults([]); // Réinitialise l'état
  };

  const handleSearch = (specialty, location) => {
    const results = fakeDoctors.filter(
      (doctor) =>
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) &&
        doctor.address.toLowerCase().includes(location.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="App">
      <Header />
      <main>
        {searchResults.length === 0 ? (
          <Hero onSearch={handleSearch} />
        ) : (
          <SearchResultsLayout
            searchResults={searchResults}
            onSearch={handleSearch}
            onReset={onReset}
          />
        )}
        <MedicalGrid />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Accueil;
