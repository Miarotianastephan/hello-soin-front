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
    const [listPratique, setListePratique] = useState(1);
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
    },[actualTab])

    function handleNewData(newData){
        setListePratique(newData);
        console.log("New data setted : " + newData);
    }
    
    return(
        <Tabs value={actualTab}>
            <TabsHeader>
            {tabs_sections.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => {setActualTab(value)}}>
                {label}
                </Tab>
            ))}
            </TabsHeader>
            <TabsBody>
            {tabs_sections.map((d) => (
                <TabPanel key={d.value} value={d.value} >
                < d.desc myAction={handleNewData}/>
                </TabPanel>
            ))}
            </TabsBody>
        </Tabs>
    );
}
export default Pratiques;