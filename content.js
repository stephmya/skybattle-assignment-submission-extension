// Function to play sound with detailed error handling
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

// Function to add text change listener to the button
function addTextChangeListener(button) {
    const textObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const currentText = button.textContent.trim();
            // Check for text indicating submission process
            if (currentText.includes("Submitting") || currentText.includes("Marking as done") || currentText.includes("Mark as Complete") || currentText.includes("Submit Quiz")) {
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

// Function to detect submission actions in Google Classroom
function detectGoogleClassroomSubmission() {
    function checkForButton() {
        const buttons = document.querySelectorAll('div[role="button"]');
        buttons.forEach(button => {
            const buttonText = button.textContent.trim();
            // Correct use of includes for multiple conditions
            if (buttonText.includes("Turn in") || buttonText.includes("Mark as done") || buttonText.includes("Turning in")) {
                addTextChangeListener(button);
            }
        });
    }

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver(checkForButton);
    observer.observe(document.body, { childList: true, subtree: true });

    checkForButton();
}

// Function to detect submission actions in Brightspace
function detectBrightspaceSubmission() {
    function checkForButton() {
        const buttons = document.querySelectorAll('button, a'); // Target all buttons and anchor elements
        buttons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase(); // Normalize text to lower case for comparison
            // Check for general submission phrases and specific cases like "Submit Quiz"
            if (buttonText.includes("submit") || buttonText.includes("mark as complete") || buttonText.includes("upload") || buttonText.includes("save") || buttonText.includes("turn in") || buttonText.includes("submit quiz")) {
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
    const url = window.location.href;
    if (url.includes('classroom.google.com')) {
        detectGoogleClassroomSubmission();
    } else if (url.includes('mylearning')) { // Adjust to match your Brightspace URL
        detectBrightspaceSubmission();
    }
});



// poop