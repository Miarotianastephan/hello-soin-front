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
    const data = [
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
    
    return(
        <Tabs value={actualTab}>
            <TabsHeader>
            {data.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => {setActualTab(value)}}>
                {label}
                </Tab>
            ))}
            </TabsHeader>
            <TabsBody>
            {data.map((d) => (
                <TabPanel key={d.value} value={d.value} >
                < d.desc />
                </TabPanel>
            ))}
            </TabsBody>
        </Tabs>
    );
}
export default Pratiques;