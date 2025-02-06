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

const ColorPicker = ({ label, color, setColor }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 border rounded-lg cursor-pointer"
                />
                <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export function FormAjoutPratique (){
    const [color, setColor] = useState("#ff0000");
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
                <form className="mt-8 mb-2 max-w-auto">
                    <div className="mb-1 grid grid-cols-2 xs:grid-cols-1 gap-6">
                        <Input variant="outlined" label="Type de pratique" placeholder="Choisissez une type de pratique"/>
                        <Input variant="outlined" label="Duree" placeholder="Entrer une duree en minutes"/>
                        <Input variant="outlined" label="Tarifs" placeholder="Entrer un tarif"/>
                        <Input variant="outlined" label="Date premiere xp" placeholder="Date validation du pratique"/>
                        <ColorPicker label="Choisir une couleur" color={color} setColor={setColor} />
                    </div>
                    <Button className="mt-6" fullWidth>
                        Valider
                    </Button>
                </form>
                </CardBody>
            </Card>
        </>
    );
}