import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
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
} from "@material-tailwind/react";
import { Separator } from "@/components/ui/separator"
import { BookKey } from "lucide-react";
 
const TABLE_HEAD = ["Type de pratique", "Tarif(en euro)", "Duree", "Pratique depuis", ""];
 
const TABLE_ROWS = [
  {
    code_couleur: "red",
    type: "Naturopathie",
    tarif: "150",
    duree: "3 heures",
    date: "23/04/18",
  },
  {
    code_couleur: "#5DA781",
    type: "Massage",
    tarif: "150",
    duree: "3 heures",
    date: "23/04/18",
  },
];
// Pour le detail d'une pratiques
const TITLE_DETAIL_PRATIQUE = {
    type: "Type",
    tarif: "Tarif",
    duree: "Duree",
    date: "Annee XP",
    commentaire: "Description",
    rdv_total: "Total Rdv",
}
const DETAIL_PRATIQUE = {
    code_couleur: "#5DA781",
    type: "Naturopathie",
    tarif: "150",
    duree: "3 heures",
    date: "23/04/18",
    commentaire: "Cette pratique a été réalisée avec succès",
    rdv_total: 22,
}
const DetailPratiqueCard = ({titles,details}) => {
    return(
        Object.entries(details).map(([key, value]) => (
            titles[key] !== undefined && (
            <div key={key} className="flex items-start justify-between gap-5">
                <Typography variant="small" className="mb-5 font-bold" color="blue-gray"> 
                {titles[key] || ""}
                </Typography>
                <Typography variant="small" color="gray" className="text-end">
                {value || "N/A"}
                </Typography>
            </div>
            )
        ))
    );
}

 
export function ListPratique() {

  return (
    <>
        <div className="flex bg-gray-100 p-2 rounded-xl gap-2 flex-col md:flex-row">
            <Card className="">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                            Pratiques disponibles
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                            Liste de pratiques répertoriées dans votre compte Hello Soin.
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3" size="sm">
                            ajouter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                            key={head}
                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                            >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                {head}
                            </Typography>
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map(
                        ({ code_couleur, type, tarif, duree, date }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";
            
                            return (
                            <tr key={type}>
                                {/* Type de pratique */}
                                <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <Chip value="" style={{backgroundColor:code_couleur }}/>
                                    <div className="flex flex-col">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {type}
                                    </Typography>
                                    </div>
                                </div>
                                </td>
                                {/*  */}
                                <td className={classes}>
                                <div className="flex flex-col">
                                    <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold"
                                    >
                                    {tarif} euro
                                    </Typography>
                                </div>
                                </td>
                                <td className={classes}>
                                    <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                    >
                                    {duree}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                <div className="w-max">
                                    <Chip
                                        variant="ghost"
                                        size="lg"
                                        value={date}
                                        className="font-bold"
                                        color="purple"
                                    />
                                </div>
                                </td>
                                <td className={classes}>
                                <Tooltip content="Edit User">
                                    <IconButton variant="text">
                                    <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                                </td>
                            </tr>
                            );
                        },
                        )}
                    </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                    </Typography>
                    <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                    </div>
                </CardFooter>
            </Card>
            <Card className="bg-white w-full max-h-max">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <Typography variant="h6" color="blue-gray">
                        Details pratique
                    </Typography>
                    <Separator orientation="horizontal" className="bg-gray-500" />
                </CardHeader>
                <CardBody>
                    <DetailPratiqueCard titles={TITLE_DETAIL_PRATIQUE} details={DETAIL_PRATIQUE} />
                </CardBody>
            </Card>
        </div>
    </>
  );
}