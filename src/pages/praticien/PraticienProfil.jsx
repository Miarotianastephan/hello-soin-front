import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { Phone,MailIcon,MapPinHouse } from "lucide-react";

const PraticienProfil = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-2 bg-gray-100 rounded-xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-4xl w-full p-6 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col items-start md:flex-row gap-6">
            <div className="md:w-1/3 w-full text-center mb-8 md:mb-0">
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile Picture"
                className="rounded-full w-48 h-48 mx-auto mb-4 transition-transform duration-300 hover:scale-105"
              />
              <Typography variant="h5" className="mt-1 font-bold">
                Mariana Rodrigez
              </Typography>
              <div className="mt-4 flex flex-col items-center">
                <Chip
                  variant="ghost"
                  color="green"
                  size="sm"
                  value="Active"
                  icon={
                    <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                  }
                  className="w-max h-max"
                />
                <Separator orientation="horizontal" className="mt-2" />
                <Button className="gap-3 mt-2" size="sm">
                  Modifier profil
                </Button>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <Typography variant="h5" className="mt-1 font-bold">
                Description
              </Typography>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                quasi quibusdam maiores eos, eaque, enim animi molestiae quia
                error et asperiores est dolores libero, debitis rem dignissimos
                possimus accusantium odio?
              </p>
              <Typography variant="h5" className="mt-1 font-bold mb-4">
              Disciplines
              </Typography>
              <div className="flex flex-wrap gap-2 mb-6">
                <Chip
                  variant="ghost"
                  color="purple"
                  size="sm"
                  value="Massage"
                  className="w-max h-max"
                />
                <Chip
                  variant="ghost"
                  color="purple"
                  size="sm"
                  value="Acuponcteur"
                  className="w-max h-max"
                />
              </div>
              <Typography variant="h5" className="mt-1 font-bold mb-4">
              Contact
              </Typography>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5"/>
                  mariana.rodriguez@example.com
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon className="h-5 w-5"/>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPinHouse className="h-5 w-5"/>
                  12 Rue, Paris, France
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PraticienProfil;
