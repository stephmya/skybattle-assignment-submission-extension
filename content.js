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
    // console.log("Adding MutationObserver to button:", button.textContent.trim());
    const textObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const currentText = button.textContent.trim();
            // console.log("Button text changed to:", currentText);
            if (currentText.includes("Turning in") || currentText.includes("Marking as done")) {
                // console.log("Detected 'Turning in' or 'Marking as done' state, preparing to play sound.");
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
    function checkForButton() {
        const buttons = document.querySelectorAll('div[role="button"]');
        buttons.forEach(button => {
            const buttonText = button.textContent.trim();
            if (buttonText.includes("Turn in") || buttonText.includes("Mark as done") || buttonText.includes("Turning in") || buttonText.includes("Marking as done")) {
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

function detectBrightspaceSubmission() {
    console.log("Brightspace detection script loaded.");

    // Function to detect submission buttons and log their presence
    function logButtonPresence() {
        // Select all possible buttons related to submission actions
        const buttons = document.querySelectorAll('button, div[role="button"]');
        console.log("Scanning for Brightspace submission buttons...");

        buttons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            
            // Check if the button text is related to submission actions
            if (buttonText.includes("submit") || 
                buttonText.includes("mark as complete") || 
                buttonText.includes("upload") || 
                buttonText.includes("save") || 
                buttonText.includes("turn in") || 
                buttonText.includes("submit quiz") || 
                buttonText.includes("post")) {
                
                // Log button presence
                console.log("Brightspace submission button detected on the page:", buttonText);
                addTextChangeListener(button); // Add the listener for any text changes
            }
        });
    }

    // Observe DOM changes to detect and log buttons as they are added to the page
    const observer = new MutationObserver(() => {
        console.log("DOM changed, checking for new Brightspace buttons...");
        logButtonPresence();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial detection of buttons on page load
    logButtonPresence();
}

// Ensure the script runs after the page is fully loaded
window.addEventListener('load', function() {
    if (window.location.href.includes('brightspace') || window.location.href.includes('d2l')) {
        detectBrightspaceSubmission();
    }
});
