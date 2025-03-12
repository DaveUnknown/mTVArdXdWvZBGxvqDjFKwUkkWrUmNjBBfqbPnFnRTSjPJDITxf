import { playSFX, preloadSFX} from "./audioUtil.js";

const deep_impact = "../assets/sfx/echoe-deep-impact.mp3"
const tension = "../assets/sfx/tension-dramatic.mp3"
const glitch = "../assets/sfx/radio-glitch.mp3"
const typing = "../assets/sfx/typewriter.mp3"
preloadSFX([deep_impact, tension, glitch, typing]);

let ran = false
let giveTimeToPlay = false 

const displayText = document.querySelector(".hero-container");
const topTitle = document.querySelector(".centeredTitle");

// type write
const progress = document.querySelector(".progress");
const progressDate = document.querySelector(".progress-date");
function typeWrite(element, text, callback) {
    playSFX(typing);
    console.log("playing sfx...")
    const textArray = text.split('');
    element.innerHTML = '';
    textArray.forEach((letter, i) => {
        setTimeout(() => {
            element.innerHTML += letter;
        }, 200 * i)
    });
    setTimeout(() => {
        console.log("stop playing sfx...")
    }, 200 * textArray.length);

    setTimeout(() => {
        callback && callback();
    }, 300 * textArray.length);
}

const blackSphere = document.querySelector(".black-sphere");
const blueSphere = document.querySelector(".blue-sphere");

// Get center of the screen
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;

    // Calculate offsets based on distance from center
    const offsetX = (clientX - centerX) * 0.08; // 10% movement
    const offsetY = (clientY - centerY) * 0.08;
    
    // Move black orb (more movement)
    blueSphere.style.transform = `translate(${offsetX * -5}px, ${offsetY * -5}px)`;

    // Move blue orb (less movement for parallax effect)
    blackSphere.style.transform = `translate(${offsetX * 5}px, ${offsetY * 5}px)`;

    // Calculate distance between the two spheres
    const dx = Math.abs(offsetX * 0.2); // Difference in X movement
    const dy = Math.abs(offsetY * 0.2); // Difference in Y movement
    const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance

    // Adjust brightness based on distance
    const brightness = Math.max(1 - (distance / 3), 0);

    // Ensure brightness adjustment is an integer
    const r = Math.min(Math.round(88 + brightness * 30 * 5.5), 240);  // Adjusted scaling for effect
    const g = Math.min(Math.round(167 + brightness * 30 * 3), 240);
    const b = 255;  // Keeping blue at 255 for consistency
    // console.log("brightness: ", brightness," r: ", r, " g: ", g, " b: ", b)

    // Apply radial gradient with adjusted brightness
    blueSphere.style.background = `radial-gradient(circle, rgba(${r},${g},${b},1) 0%, 
                                                 rgba(${r},${g},${b},1) 50%, 
                                                 rgba(${r},${g},${b},0.8) 70%, 
                                                 rgba(${r},${g},${b},0.8) 80%, 
                                                 rgba(${r},${g},${b},0.1) 100%)`;
    
                                         
    setTimeout(() => {
        giveTimeToPlay = true
    }, 2000)                                         
    // If perfectly aligned, fade out
    if ((distance < 0.1) && !ran && giveTimeToPlay) {
        ran = true
        setTimeout(() => {
            document.querySelector(".gradient-bg").style.background = "linear-gradient(rgba(0,0,0,1), rgba(0,0,0,1))";
            playSFX(deep_impact);
            blueSphere.style.display = "none";
            blackSphere.style.display = "none";
            setTimeout(() => {
                topTitle.style.opacity = 1;
                playSFX(tension);
                document.querySelector(".noise-texture").style.display = "block";
                document.querySelector(".gradient-bg").style.background = "linear-gradient(180deg, #191a21 0%, #181920 100%)";
            }, 2000)

            setTimeout(() => {
                displayText.style.opacity = 1;
                playSFX(glitch, { loop: true });
                
            }, 4000)
            setTimeout(() => {
                typeWrite(progress, "This page is a work in progress.", () => {
                    typeWrite(progressDate, "ESTIMATED COMPLETION: 01/08/2025");
                }, 1000);
            }, 8000);
            
     }, 200)
        
    }
});
