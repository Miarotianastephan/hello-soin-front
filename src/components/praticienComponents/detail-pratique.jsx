import { Typography } from "@material-tailwind/react";
import { Info } from "lucide-react";
import { convertToEuroFormat, UNITE_MINUTE } from "./constant";

const DetailPratiqueCard = ({ details }) => {
    return (
      <>
        {!details ? (
          <p className="flex items-center gap-2 text-gray-600">
            <Info className="w-5 h-5 text-helloSoin" />
            Veuillez choisir un détail à afficher.
          </p>
        ) : (
            <>
            {/* Designation du pratique */}
                <div key="nom_discipline" className="flex items-start justify-between gap-5">
                    <Typography
                    variant="small"
                    className="mb-5 font-bold"
                    color="blue-gray"
                    >
                    Type de pratique
                    </Typography>
                    <Typography variant="small" color="gray" className="text-end">
                    {details.nom_discipline || "N/A"}
                    </Typography>
                </div>
            {/* Tarif du pratique */}
                <div key="tarif" className="flex items-start justify-between gap-5">
                    <Typography
                    variant="small"
                    className="mb-5 font-bold"
                    color="blue-gray"
                    >
                    Tarif
                    </Typography>
                    <Typography variant="small" color="gray" className="text-end">
                    {convertToEuroFormat(details.tarif) || "N/A"}
                    </Typography>
                </div>
            {/* Duree du pratique */}
                <div key="duree" className="flex items-start justify-between gap-5">
                    <Typography
                    variant="small"
                    className="mb-5 font-bold"
                    color="blue-gray"
                    >
                    Durée
                    </Typography>
                    <Typography variant="small" color="gray" className="text-end">
                    {details.duree ? `${details.duree} ${UNITE_MINUTE}` : "N/A"}
                    </Typography>
                </div>
            {/* Description du pratique */}
                <div key="description" className="flex items-start justify-between gap-5">
                    <Typography
                    variant="small"
                    className="mb-5 font-bold"
                    color="blue-gray"
                    >
                    Description
                    </Typography>
                    <Typography variant="small" color="gray" className="text-end">
                    {details.desc_pratique || "N/A"}
                    </Typography>
                </div>
            </>
        )}
      </>
    );
  };

  export default DetailPratiqueCard;