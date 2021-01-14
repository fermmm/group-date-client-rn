import React, { FC } from "react";
import { useRoute } from "@react-navigation/native";

interface RouteParams {
   startingQuestion: number;
}

const ChangeQuestionsPage: FC = () => {
   const route = useRoute();
   const routeParams = route.params as RouteParams;

   return null;
   // return (
   //    <QuestionsPage
   //       appBarTitle={"Modificar preguntas"}
   //       backButtonChangesPage={true}
   //       startingQuestion={routeParams?.startingQuestion ?? 0}
   //       showBottomButtons={routeParams?.startingQuestion == null}
   //       onFinishGoBack
   //    />
   // );
};

export default ChangeQuestionsPage;
