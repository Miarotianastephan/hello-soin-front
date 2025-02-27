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

  useEffect(() => {
    register("description", {
      required: "La description est requise",
      minLength: {
        value: 10,
        message: "La description doit contenir au moins 10 caractères",
      },
    });
  }, [register]);

  useEffect(() => {
    register("discipline", {
      required: "Le type de discipline est requis",
    });
  }, [register]);

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
                {editedPratique !== null
                  ? "Modifier la pratique"
                  : "Créer une pratique"}
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
            className="mt-2 mb-2 max-w-auto"
            onSubmit={handleSubmit(onSubmittingForm)}
          >
            <div className="mb-1 flex flex-wrap gap-6 h-auto">
              <div className="md:w-[50%] flex flex-col gap-4">
                {/* Type et nom */}
                <div className="w-full h-auto flex flex-col gap-3">
                  {/* type de dscipline */}
                  <div className="flex flex-col gap-1">
                    <Select
                      variant="outlined"
                      label="Type de Discipline"
                      onChange={(value) =>
                        setValue("discipline", value, { shouldValidate: true })
                      }
                      value={watch("discipline")}
                    >
                      <Option value="disp_1">Acuponcteur</Option>
                      <Option value="disp_2">Orthopediste</Option>
                      <Option value="disp_3">Naturopathe</Option>
                    </Select>
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.discipline?.message}
                    </p>
                  </div>
                  {/* nom du pratique */}
                  <div className="flex flex-col gap-1">
                    <Input
                      variant="outlined"
                      label="*Désignation de la pratique"
                      placeholder="Entrer un nom a votre pratique"
                      {...register("nom", {
                        required: "Le nom de la pratique est requis",
                        maxLength: {
                          value: 100,
                          message: "Le nom ne peut pas dépasser 100 caractères",
                        },
                      })}
                    />
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.nom?.message}
                    </p>
                  </div>
                </div>
                {/* Date debut du pratique */}
                <div className="w-full flex flex-col gap-3">
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
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
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
                      {...register("tarif", {
                        required: "Le tarif est requis",
                        min: {
                            value: 1,
                            message: "Le tarif doit être d'au moins 1 euro",
                        },
                        pattern: {
                          value: /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/,
                          message:
                            "Le tarif doit être un nombre avec une décimale (ex: 12.50) ou un nombre entier",
                        },
                      })}
                    />
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.tarif?.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      variant="outlined"
                      label="Durée (en minutes)"
                      placeholder="Entrer la durée"
                      {...register("duree", {
                        required: "La durée est requise",
                        min: {
                          value: 1,
                          message: "La durée doit être d'au moins 1 minute",
                        },
                        max: {
                          value: 1440,
                          message: "La durée ne peut pas dépasser 1440 minutes (24 heures)",
                        },
                        pattern: {
                          value: /^(0|[1-9][0-9]*)$/,
                          message: "La durée ne doit pas commencer par zéro ou/et doit être un nombre entier",
                        },
                      })}
                    />
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.duree?.message}
                    </p>
                  </div>
                </div>
                {/* Description du pratique */}
                <div className="w-full">
                  <Textarea
                    label="Informations sur la pratique"
                    onChange={(e) =>
                      setValue("description", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    value={watch("description")}
                  />
                  <p className="text-balance text-left text-xs text-destructive">
                    {errors.description?.message}
                  </p>
                </div>
              </div>

              {/* Choix du lat/long */}
              <div className="flex-1 w-auto min-h-[400px]">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="hidden mb-4 font-medium"
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
