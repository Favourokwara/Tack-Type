/** 
 * @author        Favour Okwara
 * @description   A simple typing playground built to improve typing speed.
 * 
 * @package       Tack-Type
 * @version       v1.0.1
 * @license       MIT License
 * 
 * @copyright     © 2022 Favour Okwara All rights reserved.
 * @see           <https://github.com/Favourokwara>
 */

 import { Text } from "./text.js";
 import { Typing } from "./typing.js";
 import { UI } from "./ui.js";
 
 document.addEventListener("DOMContentLoaded", async function () {
    const txt = (new Text());
    const ui = (new UI());
    const typing = (new Typing());
 
    // buttons
    const buttons = document.getElementsByTagName("button");
    const reset_btn = document.querySelector(".reset-btn");
    const pause_btn = document.querySelector(".pause-btn");
    const theme_btn = document.querySelector(".theme-btn");
 
    
    // load initial playground
    await txt.init();
    typing.updateCursor()
 
    typing.metricsInterval()
 
    document.addEventListener("keydown", typing.keyPress)
 
    // button functionality
    reset_btn.addEventListener("click", () => {
       txt.load()
       typing.reset()
    })
    pause_btn.addEventListener("click", () => {
       typing.toggleTyping()
    })
    theme_btn.addEventListener("click", () => {
       document.body.classList.toggle("dark")
    })
 
    // button ripple effect
    for (const button of buttons) {
       button.addEventListener("click", ui.createRipple);
    }
 
    // reposition text in browser
    window.addEventListener("resize", () => {
       typing.displace()
    })
 
 })