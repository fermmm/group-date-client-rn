import { PolyEvent } from "./interfaces/PolyEvent";

const testEvent1: PolyEvent = {
   title: "Socializala #26 ~ Amor Libre Argentina",
   description: "Nos encontramos para celebrar la forma que elegimos relacionarnos y que cada vez somos más. Llega octubre y como somos muy originales lo hacemos con un SocializALA DE DISFRACES!! Este viernes 25 de octubre llega el socializALA especial halloween !!👻👻👻",
   imageLink: "https://scontent.faep22-1.fna.fbcdn.net/v/t1.0-9/72881819_2774212932609862_786217063730380800_n.jpg?_nc_cat=101&_nc_oc=AQkrdNREy6VbvjPslP-WfibSJDDOpu3A9k8PfdU9H4ZK882XkbO-j7a4sVfZOmuDZnw&_nc_ht=scontent.faep22-1.fna&oh=45f753e6f8332d5972540686fb34c89a&oe=5E26251C",
   address: "Rivadavia 1180",
   time: "Hoy de 21:00 a 04:00",
   link: "https://www.facebook.com/events/1770869566553161/",
};

const testEvent2: PolyEvent = {
   title: "AmArte Libre -> Charlas/Arte/Feria",
   description: "EL MIÉRCOLES 06 LLEGA ~AmArte Libre~ Les invitamos a participar de esta nueva propuesta cultural enfocada en el amor libre, entendido como relaciones sanas y diversas; la comunicación no violenta y fomentando el pensamiento crítico.",
   imageLink: "https://scontent.faep22-1.fna.fbcdn.net/v/t1.0-9/72670112_2100372020270443_5843653127647002624_n.jpg?_nc_cat=104&_nc_oc=AQlmndThPqp74blpv9I0RlxSnW35ccdwxrfU14t5T88br3mutA8MG31Gj_bQoru0-08&_nc_ht=scontent.faep22-1.fna&oh=eb82b55944387188866a7509ffd0b7e2&oe=5E62734A",
   address: "Centro Cultural Tierra Violeta: Tacuarí 538",
   time: "Miércoles, 6 de noviembre de 2019 de 19:30 a 22:30",
   link: "https://www.facebook.com/events/460294114695287/",
};

export const fakeTestingEvents: PolyEvent[] = [
   testEvent1,
   testEvent2
];