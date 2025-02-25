import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ListPratique } from "@/components/praticienComponents/list-pratique";
import { FormAjoutPratique } from "@/components/praticienComponents/form-ajout-pratique";
import { useEffect, useState } from "react";

const Pratiques = () => {
    const [actualTab, setActualTab] = useState("list");
    const [listPratique, setListePratique] = useState([]);
    const [editedPratique, setEditedPratique] = useState(null);

    const tabs_sections = [
        {
          label: "Mes pratiques",
          value: "list",
          desc: ListPratique,
        },
        {
          label: "Ajouter pratique",
          value: "add",
          desc: FormAjoutPratique,
        },
    ];

    useEffect(()=>{
        if (actualTab === "list") {
            const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
            setListePratique(storedPratiques);
            // Pour reinitialiser la valeur de editedPratique
            setEditedPratique(null);
        }
    },[actualTab])

    function handleAddPratique(newPratique){
        // Ajout d 'une appelle API pour l'insertion de nouveau pratiqu
        setActualTab("list")
    }
    
    return(
        <Tabs value={actualTab} className="p-4">
            {/* <TabsList className="z-0">
                {tabs_sections.map(({ label, value }) => (
                    <TabsTrigger className="text-[16px] w-full" key={value} value={value} onClick={() => {setActualTab(value)}}>
                    {label}
                    </TabsTrigger>
                ))}
            </TabsList> */}
            {tabs_sections.map((d) => (
                <TabsContent key={d.value} value={d.value} >
                {d.value === "list" && < d.desc  listpratiques={listPratique} switchTabFunction={setActualTab} setEditedPratique={setEditedPratique}/>}
                {d.value === "add" &&  < d.desc  handleAddPratique={handleAddPratique} switchTabFunction={setActualTab} editedPratique={editedPratique}/>}
                </TabsContent>
            ))}
        </Tabs>
    );
}
export default Pratiques;