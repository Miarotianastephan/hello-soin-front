import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Specifique from "./onglet/specifique/specifique";
import General from "./onglet/general/general";
export default function Disponibilite() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="mx-5">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList >
          <TabsTrigger value="general">Agenda général</TabsTrigger>
          <TabsTrigger value="specifique">Agenda spécifique</TabsTrigger>
        </TabsList>

        <div>
          <CardContent className="p-4">
            <TabsContent value="general">
             <General/>
            </TabsContent>
            <TabsContent value="specifique">
              <Specifique/>
            </TabsContent>
          </CardContent>
        </div>
      </Tabs>
    </div>
  );
}
