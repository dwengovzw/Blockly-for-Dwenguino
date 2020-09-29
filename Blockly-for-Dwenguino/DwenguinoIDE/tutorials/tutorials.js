import { introduction } from "./dwenguino/introduction.js"
import { avoidWall } from "./ridingrobot/avoid_wall.js"
import { driveForward } from "./ridingrobot/drive_forward.js"
import { rideInSquare } from "./ridingrobot/ride_in_square.js"
import { rideToWall } from "./ridingrobot/ride_to_wall.js"
/*import { hello } from "./socialrobot/hello.js"
import { introductionSocialRobot } from "./socialrobot/introduction.js"*/
import { introduceYourself } from "./wegostem_debugging/introduce_yourself.js"
import { lampOnOffWeGoSTEM } from "./wegostem_debugging/lampje_aan_uit.js"
import { nameOnLcd } from "./wegostem_debugging/name_on_lcd.js"
import { poem1 } from "./wegostem_debugging/poem1.js"
import { poem2 } from "./wegostem_debugging/poem2.js"
import { showNameAndDisappear } from "./wegostem_debugging/show_name_and_disappear.js"
/*
 * Links interface locations to interface ids.
 */

 export { tutorials };


/*
 * See other tutoiral files for the implementation of the specific tutorials
 */
var tutorials = {
  introduction: introduction,
  avoidWall: avoidWall,
  driveForward: driveForward,
  rideInSquare: rideInSquare,
  rideToWall: rideToWall,
  /*hello: hello,
  introductionSocialRobot: introductionSocialRobot,*/
  introduceYourself: introduceYourself,
  lampOnOffWeGoSTEM: lampOnOffWeGoSTEM,
  nameOnLcd: nameOnLcd,
  poem1: poem1,
  poem2: poem2,
  showNameAndDisappear: showNameAndDisappear,
};
