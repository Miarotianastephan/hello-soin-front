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
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogTitle, AlertDialogTrigger 
  } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import DatePicker from "./date-picker";
import ColorPicker from "./color-picker";
import MapPicker from "./map-picker";
import { useEffect, useState } from "react";
import { Euro, X } from "lucide-react";
import { Label } from "../ui/label";
import { deletePratique } from "@/services/pratiques-services";

const FileUploader = ({ register }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const fileList = Array.from(files);
    
    setSelectedFiles((prev) => [...prev, ...fileList]);

    const imagePreviews = fileList.map((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });
      }
      return null;
    });

    Promise.all(imagePreviews).then((previews) => {
      setPreviewImages((prev) => [...prev, ...previews]);
    });
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid gap-2">
      {/* Zone de glisser-déposer */}
      <div
        className={`cursor-pointer w-full p-6 border-2 ${
          isDragging ? "border-helloBlue bg-blue-50" : "border-helloSoin text-helloSoin"
        } border-dashed rounded-lg text-center transition-all`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <label htmlFor="file_input" className="block">
          {isDragging ? "Déposez les fichiers ici" : "Cliquer ou glisser-déposer des fichiers"}
        </label>
      </div>

      {/* Input caché */}
      <input
        id="file_input"
        type="file"
        accept="*/*"
        multiple
        {...register("files")}
        onChange={(e) => {
          handleChange(e);
          register("files").onChange(e);
        }}
        className="hidden"
      />

      {/* Aperçu des fichiers */}
      <div className="flex flex-wrap gap-2">
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => (
            <div key={index} className="relative mt-1">
              {previewImages[index] ? (
                <img
                  src={previewImages[index]}
                  alt="Aperçu du fichier"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg border border-dashed border-helloSoin flex items-center justify-center p-2 text-[9px] overflow-hidden text-gray-600 font-bold">
                  {file.name}
                </div>
              )}
              <button
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={10} />
              </button>
            </div>
          ))
        ) : (
          <div className="h-24 w-24 rounded-lg border border-dashed border-helloGray flex items-center text-center justify-center overflow-hidden">
            <span className="text-gray-400 text-sm">Aucun fichier séléctionner</span>
          </div>
        )}
      </div>
    </div>
  );
};


export function FormAjoutPratique({
  listDiscipline,
  handlePratiqueState,
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
  const disciplines = Array.isArray(listDiscipline) ? listDiscipline : [];  
  // const [pratiques, setPratiques] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // useEffect(() => {
  //   const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
  //   setPratiques(storedPratiques);
  // }, []);

  useEffect(() => {
    // console.log(editedPratique?.files)
    if (editedPratique) {
      reset(editedPratique);
    }
  }, [editedPratique, reset]);

  useEffect(() => {
    register("desc_pratique", {
      required: "La desc_pratique est requise",
      minLength: {
        value: 10,
        message: "La desc_pratique doit contenir au moins 10 caractères",
      },
    });
  }, [register]);

  useEffect(() => {
    register("id_discipline", {
      required: "Le type de id_discipline est requis",
    });
  }, [register]);

  function onSubmittingForm(data) {
    console.log(data);
    // update
    if (editedPratique) {
      handlePratiqueState(JSON.stringify(data), true);
    }
    // save
    else {
      handlePratiqueState(JSON.stringify(data), false);
    }
  }

  function handleRemovedPratique(editedPratique){
    // const id_pratique = editedPratique.id_pratique
    async function fetchDeletePratique(){
      const response = await deletePratique(editedPratique);
      console.log(response);
      switchTabFunction("list")
    }
    fetchDeletePratique();
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="md:p-2 bg-gray-100 rounded-lg">
      <Card className="max-w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <Typography variant="h5" className="text-helloBlue">
                {editedPratique !== null
                  ? "Modifier le pratique"
                  : "Créer une pratique"}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-helloBlue">
                Merci de compléter tous les champs
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {editedPratique && (
                <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="flex items-center gap-3 bg-helloOrange" size="sm">
                    Supprimer ce pratique
                    </Button>
                </AlertDialogTrigger>
                
                {/* Contenu du popup de confirmation */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer la pratique ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer <strong>{editedPratique.nom_discipline}</strong> ? Cette action est irréversible.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemovedPratique(editedPratique)}>
                        Oui, supprimer
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            )}
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
              <div className="w-full flex flex-col gap-4">
                {/* Type et nom */}
                <div className="w-full h-auto flex flex-col gap-3">
                  {/* type de discipline */}
                  <div className="flex flex-col gap-1">
                    <Select
                      variant="outlined"
                      label="Type de Discipline"
                      onChange={(value) =>
                        setValue("id_discipline", value, { shouldValidate: true })
                      }
                      value={watch("id_discipline")}
                    >
                      {disciplines.map((discip, index) => (
                        <Option key={index} value={discip.id_discipline}>{discip.nom_discipline}</Option>
                      ))}
                    </Select>
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.id_discipline?.message}
                    </p>
                  </div>
                  {/* nom du pratique */}
                  {/* <div className="flex flex-col gap-1">
                    <Input
                      variant="outlined"
                      label="*Désignation de la pratique"
                      placeholder="Entrer un nom a votre pratique"
                      {...register("nom_discipline", {
                        required: "Le nom de la pratique est requis",
                        maxLength: {
                          value: 100,
                          message: "Le nom ne peut pas dépasser 100 caractères",
                        },
                      })}
                    />
                    <p className="text-balance text-left text-xs text-destructive">
                      {errors.nom_discipline?.message}
                    </p>
                  </div> */}
                </div>
                {/* Date debut du pratique */}
                <div className="w-full flex flex-col gap-3">
                  {/* <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-medium"
                    >
                      Début de la pratique
                    </Typography>
                    <DatePicker control={control} name="date_debut" />
                  </div> */}
                  <ColorPicker
                    control={control}
                    name="code_couleur"
                    label="Couleur de sélection"
                    rules={{ required: "La couleur est requise" }}
                  />
                </div>
                {/* Tarif et Duree */}
                <div className="w-full flex flex-rows xs:flex-col gap-3">
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      type="number"
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
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                    type="number"
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
                          message:
                            "La durée ne peut pas dépasser 1440 minutes (24 heures)",
                        },
                        pattern: {
                          value: /^(0|[1-9][0-9]*)$/,
                          message:
                            "La durée ne doit pas commencer par zéro ou/et doit être un nombre entier",
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
                      setValue("desc_pratique", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    value={watch("desc_pratique")}
                  />
                  <p className="text-balance text-left text-xs text-destructive">
                    {errors.desc_pratique?.message}
                  </p>
                </div>
                {/* Images de preuves */}
                <FileUploader register={register} />
              </div>

              {/* Choix du lat/long */}
              {/* <div className="flex-1 w-auto min-h-[400px]">
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
              </div> */}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="w-max mt-6 bg-helloBlue" fullWidth>
                {editedPratique !== null
                  ? "Modifier le pratique"
                  : "Créer le pratique"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
