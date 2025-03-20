import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ListPratique } from "@/components/praticienComponents/list-pratique";
import { FormAjoutPratique } from "@/components/praticienComponents/form-ajout-pratique";
import { useEffect, useState } from "react";
import { findDisciplines,findPratiques,savePratique,updatePratique } from "@/services/pratiques-services";

const Pratiques = () => {
    const [actualTab, setActualTab] = useState("list");
    const [listDiscipline, setListeDiscipline] = useState([]);
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

    useEffect( () => {
        async function fetchDisciplines(){
            const disciplines = await findDisciplines();
            setListeDiscipline(disciplines);
        }
        fetchDisciplines();
    },[])

    useEffect( () => {
        async function fetchPratiques(){
            if (actualTab === "list") {
                const pratiques = await findPratiques();
                setListePratique(pratiques);
                setEditedPratique(null);// reset du formulaire
            }
        }
        fetchPratiques();
    },[actualTab])

    function handlePratiqueState(pratiques, isUpdate){
        if(isUpdate === false){
            async function fetchNewPratique(){
                const response = await savePratique(pratiques);
                console.log(response);
                setActualTab("list")
            }
            fetchNewPratique();
        }else{
            async function fetchUpdatePratique(){
                console.log(pratiques)
                const response = await updatePratique(pratiques);
                console.log(response);
                setActualTab("list")
            }
            fetchUpdatePratique();
        }
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
                {d.value === "add" &&  < d.desc listDiscipline={listDiscipline} handlePratiqueState={handlePratiqueState} switchTabFunction={setActualTab} editedPratique={editedPratique}/>}
                </TabsContent>
            ))}
        </Tabs>
    );
}
export default Pratiques;