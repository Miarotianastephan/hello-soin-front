import { Info, Pencil } from "lucide-react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { Separator } from "@/components/ui/Separator";
import { useState } from "react";
import DetailPratiqueCard from "./detail-pratique";
import { convertToEuroFormat, UNITE_MINUTE } from "./constant";

// Clés pour le LocalStorage
const STORAGE_KEY = "pratiques";

const TABLE_HEAD = ["Type de pratique", "Tarif (en euro)", "Durée", ""];

export function ListPratique({
  listpratiques,
  switchTabFunction,
  setEditedPratique,
}) {
  const pratiques = Array.isArray(listpratiques) ? listpratiques : [];
  const [selectedPratique, setSelectedPratique] = useState(null);

  function handleUpdatePratique(dataPratique) {
    setEditedPratique(dataPratique);
    switchTabFunction("add");
  }

  return (
    <div className="max-w-full flex bg-gray-100 md:p-2 rounded-xl gap-2 flex-col md:flex-row">
      <Card className="w-2/3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Pratiques disponibles
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Liste des pratiques associées à votre compte Hello Soin.
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => switchTabFunction("add")}
              >
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
              {pratiques.length > 0 ? (
                pratiques.map(
                  (
                    { code_couleur, nom_discipline, tarif, duree, date },
                    index,
                    allData
                  ) => {
                    const isLast = index === pratiques.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={nom_discipline} className="cursor-normal hover:bg-gray-100">
                        {/* Type de pratique */}
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Chip
                              value=""
                              style={{ backgroundColor: code_couleur }}
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {nom_discipline}
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
                              {convertToEuroFormat(tarif)}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {duree} {UNITE_MINUTE}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Details">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                setSelectedPratique(allData[index])
                              }
                            >
                              <Info className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Modifier">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                handleUpdatePratique(allData[index])
                              }
                            >
                              <Pencil className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Aucune pratique enregistrée. Cliquez sur ‘Ajouter’ pour en
                    créer une.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* Detail du pratiques choisis */}
      <Card className="bg-white md:w-1/3 w-full max-h-max">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6" color="blue-gray">
            Détails de la pratique
          </Typography>
          <Separator orientation="horizontal" className="bg-gray-500" />
        </CardHeader>
        <CardBody>
          <DetailPratiqueCard
            details={selectedPratique}
          />
        </CardBody>
      </Card>
    </div>
  );
}
