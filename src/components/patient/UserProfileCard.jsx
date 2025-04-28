import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Pencil, Upload } from "lucide-react";
import { API_URL } from "@/services/api";

const UserProfileCard = () => {
  // État des informations utilisateur
  const [user, setUser] = useState({
    id_users: undefined,
    user_name: "",
    user_forname: "",
    adresse: "",
    code_postal: undefined,
    ville: "",
    user_created_at: "",
    user_date_naissance: "",
    user_mail: "",
    user_password: "",
    user_phone: "",
    user_photo_url: "",
    id_type_user: undefined,
    mot_de_passe: ""
  });

  // État temporaire pour modifier les informations
  const [editUser, setEditUser] = useState(user);

  // useEffect(() => {
  //   const data = F('user_data');
  //   setUser(data);
  //   setEditUser(user);
  // },[])

  // Gérer la mise à jour des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // Sauvegarde des modifications
  const handleSave = (e) => {
    e.preventDefault();
    console.log(editUser);
    setUser(editUser);
  };

  // Gérer le changement de photo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, user_photo_url: imageUrl });
    }
  };


  return (
    // className="w-auto mt-4"
    <Card className="max-w-sm mx-auto p-4 aspect-video rounded-xl bg-muted/50">
      <CardHeader className="flex items-center gap-4">
        <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-200">
                <img
                src={`${API_URL}/${user.user_photo_url}`}
                // alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "")} // Efface l'image si elle ne charge pas
                />
                {!user.user_photo_url && <span className="absolute text-gray-600 text-sm">Image indisponible</span>}
            </div>
            
            {/* Bouton pour changer l'image */}
            <label className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer">
                <Upload className="text-white w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>

        <CardTitle className="text-lg">{user.user_name} {user.user_forname}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-center items-start text-[16px] space-y-3 overflow-hidden">
        <p><strong>Email :</strong> {user.user_mail}</p>
        <p><strong>Téléphone :</strong> {user.user_phone}</p>
        <p><strong>Adresse :</strong> {user.adresse}, {user.code_postal} {user.ville}</p>

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
                        <Input type="text" name="user_name" value={editUser.user_name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Prénom</Label>
                        <Input type="text" name="user_forname" value={editUser.user_forname} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="user_mail" value={editUser.user_mail} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Téléphone</Label>
                        <Input type="tel" name="user_phone" value={editUser.user_phone} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Adresse</Label>
                        <Input type="text" name="adresse" value={editUser.adresse} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                        <Label>Code Postal</Label>
                        <Input type="text" name="code_postal" value={editUser.code_postal} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                        <Label>Ville</Label>
                        <Input type="text" name="ville" value={editUser.ville} onChange={handleChange} />
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
