import { ThemeExt } from "./common-tools/themes/types/Themed";
import WhiteTheme from "./common-tools/themes/WhiteTheme";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////  APPEARANCE  //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Set the theme changing this variable, current themes available:
 * ThemeFemaleColors
 * LightTheme
 * DarkTheme
 *
 * */
export const currentTheme: ThemeExt = (WhiteTheme as unknown) as ThemeExt;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////  REGISTRATION  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The amount of images the users can upload to their profile.
 * If you are going to increase the amount make sure the server supports it.
 */
export const PROFILE_IMAGES_AMOUNT = 6;

/**
 * If this is true the target age is not prompted to the user and it's automatically set instead.
 * The user can manually set this value later after registration.
 */
export const USE_AUTOMATIC_TARGET_AGE_AT_REGISTRATION: boolean = false;

/**
 * If USE_AUTOMATIC_TARGET_AGE is true then the target age is the user age +- this value
 */
export const AUTOMATIC_TARGET_AGE: number = 10;

/**
 * If this is true the target distance is not prompt to the user and it's automatically set instead
 * The user can manually set this value later after registration.
 */
export const USE_AUTOMATIC_TARGET_DISTANCE_AT_REGISTRATION: boolean = false;

/**
 * Distances values available in KM
 */
export const AVAILABLE_DISTANCES: number[] = [50, 70, 90, 200, 600, 1000];

/**
 * If USE_AUTOMATIC_TARGET_DISTANCE is true then the target distance is this value. It must be a value from
 * the previous setting array.
 */
export const AUTOMATIC_TARGET_DISTANCE: number = 70;

/**
 * Allow the user to change the aspect ratio of the images, bad for profile page design but the users
 * have more freedom to get the best image
 */
export const LOCK_IMAGES_ASPECT_RATIO: boolean = true;

/**
 * Only works if LOCK_IMAGES_ASPECT_RATIO = true. The aspect ratio can be configured here. It's recommended
 * that the aspect ratio fits the design of the profile page.
 */
export const IMAGES_ASPECT_RATIO: [number, number] = [4, 4];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////  PERFORMANCE  /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH: number = 512;
export const IMAGE_QUALITY_WHEN_UPLOADING: number = 0.9;
