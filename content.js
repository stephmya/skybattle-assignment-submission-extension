function playSound() {
    try {
        const audio = new Audio(chrome.runtime.getURL('sound.mp3'));
        audio.play().then(() => {
            console.log("Sound played successfully.");
        }).catch(error => {
            console.error("Error playing sound:", error);
            alert("Error playing sound: " + error.message);  // Debugging alert to show errors
        });
    } catch (e) {
        console.error("Error initializing audio:", e);
        alert("Error initializing audio: " + e.message);  // Debugging alert to show initialization errors
    }
}


function addTextChangeListener(button) {
    // console.log("Adding MutationObserver to the 'Turn in' button.");
    const textObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const currentText = button.textContent.trim();
            // console.log("Button text changed to:", JSON.stringify(currentText));
            if (currentText.includes("Turning in", "Marking as done")) {
                // console.log("Text is 'Turning in...', preparing to play sound.");
                                document.body.addEventListener('click', function playSoundOnClick() {
                    playSound();
                    document.body.removeEventListener('click', playSoundOnClick); 
                });
                textObserver.disconnect();
            }
        });
    });
    textObserver.observe(button, { characterData: true, subtree: true, childList: true });
}

function detectGoogleClassroomSubmission() {
    // console.log("Content script loaded.");
    function checkForButton() {
        const buttons = document.querySelectorAll('div[role="button"]');
        // console.log("Found buttons:", buttons);
        buttons.forEach(button => {
            const buttonText = button.textContent.trim();
            // console.log("Button text content:", JSON.stringify(buttonText));
            if (buttonText.includes("Turn in", "Mark as done") || buttonText.includes("Turning in", "Mark as done")) {
                addTextChangeListener(button);
            }
        });
    }

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver(checkForButton);
    observer.observe(document.body, { childList: true, subtree: true });

    checkForButton();
}

// Ensure the script runs after the page is fully loaded
window.addEventListener('load', function() {
    if (window.location.href.includes('classroom.google.com')) {
        detectGoogleClassroomSubmission();
    }
});
