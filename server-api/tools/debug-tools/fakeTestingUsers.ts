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
      photos: [
         "http://blog.grainedephotographe.com/wp-content/uploads/2014/07/Photographe-Ben-Hopper6.png",
         "https://i.imgur.com/EIcUFYn.jpg"
      ],
   },
   {
      name: "alberto666",
      birthdate: new Date(1970, 11, 20),
      area: "El Bolsón",
      id: "1",
      photos: [
         "https://photos.bandsintown.com/large/9030937.jpeg",
      ],
   },
   {
      name: "pili",
      birthdate: new Date(1991, 11, 20),
      area: "Parque Chas",
      id: "2",
      photos: [
         "https://instagram.fymy1-1.fna.fbcdn.net/vp/c30e57dbcf2db91b8009dbdbcc1b82d7/5E0E3F5B/t51.2885-15/e35/67624761_891164491257833_7289520191745195235_n.jpg?_nc_ht=instagram.fymy1-1.fna.fbcdn.net",
         "https://instagram.fymy1-1.fna.fbcdn.net/vp/49842c983807893ba6fac5efc3ea3272/5DFBD65B/t51.2885-15/e35/65460669_116374206315813_8219770711706583022_n.jpg?_nc_ht=instagram.fymy1-1.fna.fbcdn.net"
      ],
   },
   {
      name: "jonny",
      birthdate: new Date(1972, 11, 20),
      area: "Tigre",
      id: "3",
      photos: [
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
      photos: [
         "https://66.media.tumblr.com/e1e616e5514bdfe498a7fb7e5b7fb420/tumblr_nyjfcp8nGe1qlen1do1_1280.jpg",
         "https://66.media.tumblr.com/0c63d7ac6a69e40c633aeb46016ab625/tumblr_ozdg948Wd51w3db0no1_1280.jpg",
      ],
   },
   {
      name: "maluma",
      birthdate: new Date(1990, 11, 20),
      area: "Nordelta",
      id: "5",
      photos: [
         "https://i.pinimg.com/originals/a9/73/95/a9739589169198901a9928247f9e6232.png",
         "https://i.postimg.cc/Nj20J1JP/maluma.jpg",
      ],
   },
];
