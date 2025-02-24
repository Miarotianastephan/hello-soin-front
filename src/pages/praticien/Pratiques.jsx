// import {
//     Tabs,
//     TabsHeader,
//     TabsBody,
//     Tab,
//     TabPanel,
//   } from "@material-tailwind/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListPratique } from "@/components/praticienComponents/list-pratique";
import { FormAjoutPratique } from "@/components/praticienComponents/form-ajout-pratique";
import { useEffect, useState } from "react";

const Pratiques = () => {
    const [actualTab, setActualTab] = useState("list");
    const [listPratique, setListePratique] = useState([]);
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
        console.log("Sous-page actuel : "+actualTab);
        if (actualTab === "list") {
            const storedPratiques = JSON.parse(localStorage.getItem("pratiques")) || [];
            setListePratique(storedPratiques);
            console.log("Liste des pratiques actualisée :", storedPratiques);
        }
    },[actualTab])

    function handleNewData(newData){
        // setListePratique(newData);
        // console.log("New data setted : " + newData);
        setActualTab("list")
    }
    
    return(
        <Tabs value={actualTab}>
            {/* <TabsList className="z-0">
                {tabs_sections.map(({ label, value }) => (
                    <TabsTrigger className="text-[16px] w-full" key={value} value={value} onClick={() => {setActualTab(value)}}>
                    {label}
                    </TabsTrigger>
                ))}
            </TabsList> */}
            {tabs_sections.map((d) => (
                <TabsContent key={d.value} value={d.value} >
                {d.value === "list" && < d.desc  listpratiques={listPratique} switchTabFunction={setActualTab} />}
                {d.value === "add" &&  < d.desc  myAction={handleNewData} switchTabFunction={setActualTab}/>}
                </TabsContent>
            ))}
        </Tabs>
    );
}
export default Pratiques;