import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
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
            <TabsHeader className="z-0">
            {tabs_sections.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => {setActualTab(value)}}>
                {label}
                </Tab>
            ))}
            </TabsHeader>
            <TabsBody>
            {tabs_sections.map((d) => (
                <TabPanel key={d.value} value={d.value} >
                {d.value === "list" && < d.desc  listpratiques={listPratique} />}
                {d.value === "add" &&  < d.desc  myAction={handleNewData} />}
                </TabPanel>
            ))}
            </TabsBody>
        </Tabs>
    );
}
export default Pratiques;