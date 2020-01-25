import { User } from "../../typings/User";

/**
 * This user list is used to test the UI without any server connection.
 */
export const fakeTestingUsers: User[] = [
   {
      name: "chicaprueba",
      birthdate: new Date(1989, 11, 20),
      area: "San Telmo",
      id: "0",
      images: [
         "http://blog.grainedephotographe.com/wp-content/uploads/2014/07/Photographe-Ben-Hopper6.png",
         "https://i.imgur.com/EIcUFYn.jpg"
      ],
   },
   {
      name: "alberto666",
      birthdate: new Date(1970, 11, 20),
      area: "El Bolsón",
      id: "1",
      images: [
         "https://photos.bandsintown.com/large/9030937.jpeg",
      ],
   },
   {
      name: "pili",
      birthdate: new Date(1991, 11, 20),
      area: "Parque Chas",
      id: "2",
      images: [
         "https://instagram.faep22-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/58410783_485378375620235_5654159599306713700_n.jpg?_nc_ht=instagram.faep22-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=LyfCdloFo9wAX92CKwU&oh=1860e02788e6f605d9f3ad5c1548f21e&oe=5EB80C1A"
      ],
   },
   {
      name: "jonny",
      birthdate: new Date(1972, 11, 20),
      area: "Tigre",
      id: "3",
      images: [
         "https://data.whicdn.com/images/75413003/large.jpg",
         "https://i.pinimg.com/originals/f9/dc/16/f9dc1608b6b94b29ed9070ac54b9e3b8.jpg",
         "https://files.lafm.com.co/assets/public/styles/image_631x369/public/2018-06/johnny_depp_0.jpg?itok=huih3ntS",
      ],
   },
   {
      name: "mica",
      birthdate: new Date(1993, 11, 20),
      area: "Montevideo",
      id: "4",
      images: [
         "https://66.media.tumblr.com/e1e616e5514bdfe498a7fb7e5b7fb420/tumblr_nyjfcp8nGe1qlen1do1_1280.jpg",
         "https://66.media.tumblr.com/0c63d7ac6a69e40c633aeb46016ab625/tumblr_ozdg948Wd51w3db0no1_1280.jpg",
      ],
   },
   {
      name: "maluma",
      birthdate: new Date(1990, 11, 20),
      area: "Nordelta",
      id: "5",
      images: [
         "https://i.pinimg.com/originals/a9/73/95/a9739589169198901a9928247f9e6232.png",
         "https://i.postimg.cc/Nj20J1JP/maluma.jpg",
      ],
   },
];
