import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
    Checkbox,
  } from "@material-tailwind/react";
import { useState } from "react";
import { useForm, Controller  } from "react-hook-form";

const ColorPicker = ({ control, name, label, rules }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">{label}</label>
                <div className="flex items-center gap-2">
                    <input
                    type="color"
                    value={field.value ? field.value : "#ffffff"}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-10 h-10 border rounded-lg cursor-pointer"
                    onBlur={field.onBlur} // Important for validation
                    />
                    <Input
                    type="text"
                    value={field.value ? field.value : "#ffffff"}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full"
                    onBlur={field.onBlur} // Important for validation
                    error={!!fieldState.error} // Display error state
                    />
                </div>
                {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                )}
                </div>
            )}
        />
    );
};

export function FormAjoutPratique ({myAction}){
    const [color, setColor] = useState("#ff0000");
    const { control, register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            code_couleur: "#ffffff", // Assurez-vous d'avoir une valeur par défaut ici!
        },});
    
    // handle form submission
    function onSubmittingForm(data){
        console.log(data);
        // Submit your data
        myAction(JSON.stringify(data)); // replace with your function to handle form submission
        // clear form inputs
        // handleReset();
    }

    return(
        <>
            <Card className="max-w-max">
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
                    <div className="mb-1 grid grid-cols-2 xs:grid-cols-1 gap-6">
                        <Input 
                            variant="outlined" 
                            label="Type de pratique" 
                            placeholder="Choisissez une type de pratique"
                            {...register("type")}
                        />
                        <Input 
                            variant="outlined" 
                            label="Duree" 
                            placeholder="Entrer une duree en minutes"
                            {...register("duree")}    
                        />
                        <Input 
                            variant="outlined" 
                            label="Tarifs" 
                            placeholder="Entrer un tarif"
                            {...register("tarif")}
                        />
                        <Input 
                            variant="outlined" 
                            label="Date premiere xp" 
                            placeholder="Date validation du pratique"
                            {...register("date")}    
                        />
                        <ColorPicker 
                            control={control}
                            name="code_couleur"
                            label="Choisir une couleur" 
                            rules={{required: 'La couleur est requise'}} 
                        />
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                        Valider
                    </Button>
                </form>
                </CardBody>
            </Card>
        </>
    );
}