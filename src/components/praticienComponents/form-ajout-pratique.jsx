import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import DatePicker from "./date-picker";
import ColorPicker from "./color-picker";
import MapPicker from "./map-picker";
import { useEffect, useState } from "react";
import { Euro } from "lucide-react";

export function FormAjoutPratique({
  handleAddPratique,
  switchTabFunction,
  editedPratique,
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      code_couleur: "#5DA781",
      latitude: "",
      longitude: "",
    },
  });
  const [pratiques, setPratiques] = useState([]);

  useEffect(() => {
    const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
    setPratiques(storedPratiques);
  }, []);

  useEffect(() => {
    if (editedPratique) {
      reset(editedPratique);
    }
  }, [editedPratique, reset]);

  function onSubmittingForm(data) {
    console.log(data);
    const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
    // Pour UPDATE
    if (editedPratique) {
      // Comparer avec l'ID du pratiques rehefa manmao integration avec backend
      const updatedPratiques = storedPratiques.map((p) =>
        p.nom === editedPratique.nom ? data : p
      );
      localStorage.setItem("pratiques", JSON.stringify(updatedPratiques));
      setPratiques(updatedPratiques);
    }
    // Pour INSERT
    else {
      const newPratiques = [...storedPratiques, data];
      localStorage.setItem("pratiques", JSON.stringify(newPratiques));
      setPratiques(newPratiques);
    }
    // Submit action
    handleAddPratique(JSON.stringify(data));
  }

  return (
    <div className="md:p-2 bg-gray-100 rounded-lg">
      <Card className="max-w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
              Créer une pratique
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
              Merci de compléter tous les champs
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => switchTabFunction("list")}
              >
                {editedPratique !== null
                  ? "Annuler la modification"
                  : "Mes pratiques"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="">
          <form
            className="mt-8 mb-2 max-w-auto"
            onSubmit={handleSubmit(onSubmittingForm)}
          >
            <div className="mb-1 flex flex-wrap gap-6">
              <div className="flex flex-col gap-4">
                {/* Type et nom */}
                <div className="w-full h-auto flex flex-col gap-4">
                  {/* type de dscipline */}
                  <div>
                    <Select
                      variant="outlined"
                      label="Type de Discipline"
                      onChange={(value) => setValue("discipline", value)}
                      value={watch("discipline")}
                    >
                      <Option value="disp_1">Acuponcteur</Option>
                      <Option value="disp_2">Orthopediste</Option>
                      <Option value="disp_3">Naturopathe</Option>
                    </Select>
                  </div>
                  {/* nom du pratique */}
                  <div>
                    <Input
                      variant="outlined"
                      label="Désignation de la pratique"
                      placeholder="Entrer un nom a votre pratique"
                      {...register("nom")}
                    />
                  </div>
                </div>
                {/* Date debut du pratique */}
                <div className="w-full flex flex-col gap-2">
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-medium"
                    >
                      Début de la pratique
                    </Typography>
                    <DatePicker control={control} name="date_debut" />
                  </div>
                  <ColorPicker
                    control={control}
                    name="code_couleur"
                    label="Couleur de sélection"
                    rules={{ required: "La couleur est requise" }}
                  />
                </div>
                {/* Tarif et Duree */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <Input
                    variant="outlined"
                    label="Tarifs (en euro)"
                    placeholder="Entrer le tarif"
                    icon={
                      <Euro
                        className="h-4 w-4 text-blue-gray-600"
                        strokeWidth={1}
                      />
                    }
                    {...register("tarif")}
                  />
                  <Input
                    variant="outlined"
                    label="Durée (en minutes)"
                    placeholder="Entrer la durée"
                    {...register("duree")}
                  />
                </div>
                {/* Description du pratique */}
                <div className="w-full">
                  <Textarea
                    label="Informations sur la pratique"
                    onChange={(e) => setValue("description", e.target.value)}
                    value={watch("description")}
                  />
                </div>
              </div>

              {/* Choix du lat/long */}
              <div className="flex-1 w-auto">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="hidden mb-2 font-medium"
                >
                  Choisissez un emplacement
                </Typography>
                <MapPicker
                  value={{
                    lat: watch("latitude") || 48.8566,
                    lng: watch("longitude") || 2.3522,
                  }}
                  onChange={(coords) => {
                    setValue("latitude", coords.lat);
                    setValue("longitude", coords.lng);
                  }}
                />
              </div>
            </div>
            <Button type="submit" className="mt-6" fullWidth>
              Valider
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
