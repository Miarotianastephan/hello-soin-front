import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Upload } from "lucide-react";

const UserProfileCard = () => {
  // État des informations utilisateur
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de Paris",
    city: "Paris",
    postalCode: "75001",
    profileImage: "https://via.placeholder.com/150",
  });

  // État temporaire pour modifier les informations
  const [editUser, setEditUser] = useState(user);

  // Gérer la mise à jour des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // Sauvegarde des modifications
  const handleSave = (e) => {
    e.preventDefault();
    setUser(editUser);
  };

  // Gérer le changement de photo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profileImage: imageUrl });
    }
  };

  return (
    // className="w-auto mt-4"
    <Card className="max-w-sm mx-auto p-4 aspect-video rounded-xl bg-muted/50">
      <CardHeader className="flex items-center gap-4">
        <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-200">
                <img
                src={user.profileImage}
                // alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "")} // Efface l'image si elle ne charge pas
                />
                {!user.profileImage && <span className="absolute text-gray-600 text-sm">Image indisponible</span>}
            </div>
            
            {/* Bouton pour changer l'image */}
            <label className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer">
                <Upload className="text-white w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>

        <CardTitle className="text-lg">{user.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-center items-start text-[16px] space-y-3">
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Téléphone :</strong> {user.phone}</p>
        <p><strong>Adresse :</strong> {user.address}, {user.postalCode} {user.city}</p>

        {/* Bouton Modifier (ouvre la modal) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 flex items-center gap-2" variant="outline">
              <Pencil className="w-4 h-4" /> Mettre a jour mon profil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le profil</DialogTitle>
            </DialogHeader>
                <form className="space-y-4">
                    <div>
                        <Label>Nom</Label>
                        <Input type="text" name="name" value={editUser.name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={editUser.email} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Téléphone</Label>
                        <Input type="tel" name="phone" value={editUser.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Adresse</Label>
                        <Input type="text" name="address" value={editUser.address} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                        <Label>Code Postal</Label>
                        <Input type="text" name="postalCode" value={editUser.postalCode} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                        <Label>Ville</Label>
                        <Input type="text" name="city" value={editUser.city} onChange={handleChange} />
                        </div>
                    </div>
                    <Button className="w-full mt-2" onClick={handleSave}>Enregistrer</Button>
                </form>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
