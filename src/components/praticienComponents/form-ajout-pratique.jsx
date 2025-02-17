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
import { useForm  } from "react-hook-form";
import DatePicker from "./date-picker";
import ColorPicker from "./color-picker";
import MapPicker from "./map-picker";
import { useEffect, useState } from "react";


export function FormAjoutPratique ({myAction}){
    const { 
        control, 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }, 
        watch
    } = useForm({
    defaultValues: {
        code_couleur: "#ffffff",
        latitude: "",
        longitude: "",
    },});
    const [pratiques, setPratiques] = useState([]);
    
    useEffect(() => {
        const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
        setPratiques(storedPratiques);
    }, []);

    // handle form submission
    function onSubmittingForm(data){
        console.log(data);
        
        const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
        const newPratiques = [...storedPratiques, data];
        setPratiques(newPratiques);
        localStorage.setItem("pratiques", JSON.stringify(newPratiques)); // Sauvegarde en local

        // Submit your data
        myAction(JSON.stringify(data)); // replace with your function to handle form submission
        // clear form inputs
        // handleReset();
    }

    return(
        <div className="md:p-2 bg-gray-100 rounded-lg">
            <Card className="max-w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                            Creer un pratiques
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                            Veuillez remplir toutes les champs
                            </Typography>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="">
                <form 
                    className="mt-8 mb-2 max-w-auto" 
                    onSubmit={handleSubmit(onSubmittingForm)}
                >
                    <div className="mb-1 flex flex-wrap gap-6">
                        <div className="w-full flex flex-col md:flex-row gap-4">
                            {/* type de dscipline */}
                            <Select 
                                label="Type de Discipline"
                                onChange={(value) => setValue("discipline", value)}
                            >
                                <Option value="disp_1">Acuponcteur</Option>
                                <Option value="disp_2">Orthopediste</Option>
                                <Option value="disp_3">Naturopathe</Option>
                            </Select>
                            {/* nom du pratique */}
                            <Input 
                                variant="outlined" 
                                label="Nom du Pratique" 
                                placeholder="Entrer un nom a votre pratique"
                                {...register("nom")}
                            />
                        </div>
                        {/* Description du pratique */}
                        <div className="w-full">
                            <Textarea 
                                label="Description du pratique"
                                onChange={(e) => setValue("description", e.target.value)}
                                value={watch("description")}
                            />
                        </div>
                        {/* Tarif et Duree */}
                        <div className="w-full flex flex-col md:flex-row gap-4">
                            <Input 
                                variant="outlined" 
                                label="Tarifs" 
                                placeholder="Entrer le tarif"
                                {...register("tarif")}
                            />
                            <Input 
                                variant="outlined" 
                                label="Duree" 
                                placeholder="Entrer le duree"
                                {...register("duree")}    
                            />
                        </div>
                        {/* Date debut du pratique */}
                        <div className="w-full flex flex-col md:flex-row gap-4">
                            <div className="w-1/2">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-medium"
                                >
                                    Date debut du pratique
                                </Typography>
                                <DatePicker control={control} name="date_debut" />
                            </div>
                            <ColorPicker 
                                control={control}
                                name="code_couleur"
                                label="Choisir une couleur" 
                                rules={{required: 'La couleur est requise'}} 
                            />
                        </div>
                        {/* Choix du lat/long */}
                        <div className="w-full">
                            <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                            Choisir un lieu sur la carte
                            </Typography>
                            <MapPicker 
                            value={{ lat: watch("latitude") || 48.8566, lng: watch("longitude") || 2.3522 }}
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