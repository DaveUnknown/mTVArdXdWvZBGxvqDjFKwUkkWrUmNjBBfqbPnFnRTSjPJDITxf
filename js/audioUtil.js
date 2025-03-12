export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const soundBuffers = new Map();

export async function preloadSFX(urls) {
    for (const url of urls) {
        if (soundBuffers.has(url)) continue; // Check point | prevent duplicates

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        soundBuffers.set(url, audioBuffer);
    }
}

const activeSounds = new Map(); // looping list

export function playSFX(url, options = { loop: false }) {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const buffer = soundBuffers.get(url);
    if (!buffer) {
        console.warn(`Sound ${url} not preloaded! Call preloadSFX() first.`);
        return;
    }

    if (options.loop && activeSounds.has(url)) {
        return; // Check point to prevent already looping sounds
    }

    const sound = audioContext.createBufferSource();
    sound.buffer = buffer;
    sound.loop = options.loop;
    sound.connect(audioContext.destination);

    if (options.loop) {
        activeSounds.set(url, sound);
    }

    sound.start(0);

    sound.onended = () => {
        if (!options.loop) {
            activeSounds.delete(url);
        }
    };
}

// Function to stop a looping sound
export function stopSFX(url) {
    if (activeSounds.has(url)) {
        activeSounds.get(url).stop();
        activeSounds.delete(url);
    }
}