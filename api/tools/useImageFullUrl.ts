import { ImageSourcePropType } from "react-native";
import { useServerInfo } from "../server/server-info";
import { prepareUrl } from "./httpRequest";
// @ts-ignore
import demoImage1Big from "../../assets/demo_images/demo_image1_big.jpg";
// @ts-ignore
import demoImage1Small from "../../assets/demo_images/demo_image1_small.jpg";
// @ts-ignore
import demoImage2Big from "../../assets/demo_images/demo_image2_big.jpg";
// @ts-ignore
import demoImage2Small from "../../assets/demo_images/demo_image2_small.jpg";
// @ts-ignore
import demoImage3Big from "../../assets/demo_images/demo_image3_big.jpg";
// @ts-ignore
import demoImage3Small from "../../assets/demo_images/demo_image3_small.jpg";
// @ts-ignore
import demoImage4Big from "../../assets/demo_images/demo_image4_big.jpg";
// @ts-ignore
import demoImage4Small from "../../assets/demo_images/demo_image4_small.jpg";

const demoImagesSmall: Record<string, ImageSourcePropType> = {
   demo_image1: demoImage1Small,
   demo_image2: demoImage2Small,
   demo_image3: demoImage3Small,
   demo_image4: demoImage4Small
};

const demoImagesBig: Record<string, ImageSourcePropType> = {
   demo_image1: demoImage1Big,
   demo_image2: demoImage2Big,
   demo_image3: demoImage3Big,
   demo_image4: demoImage4Big
};

/**
 * Receives the image file name and returns the full url required to download the image.
 *
 * @example
 *    const { getImageFullUrl, isLoading } = useImageFullUrl();
 *    getImageFullUrl("myImage.jpg")  // returns "https://myServer.com/images/myImage.jpg"
 */
export function useImageFullUrl() {
   const { data: serverInfo, isLoading } = useServerInfo();

   const getImageFullUrl = (
      imageFileName: string,
      size: ImageSize = ImageSize.Big
   ): ImageSourcePropType => {
      if (imageFileName.includes("demo_image")) {
         if (size === ImageSize.Small) {
            return demoImagesSmall[imageFileName];
         }

         if (size === ImageSize.Big) {
            console.log(imageFileName, demoImagesBig[imageFileName]);
            return demoImagesBig[imageFileName];
         }
      }

      if (size === ImageSize.Small) {
         return { uri: prepareUrl(serverInfo.imagesHost + imageFileName.replace("big", "small")) };
      }

      if (size === ImageSize.Big) {
         return { uri: prepareUrl(serverInfo.imagesHost + imageFileName) };
      }
   };

   return { getImageFullUrl, isLoading };
}

export enum ImageSize {
   Small,
   Big
}
