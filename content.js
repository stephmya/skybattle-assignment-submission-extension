function playSound() {
    try {
        const audio = new Audio(chrome.runtime.getURL('sound.mp3'));
        audio.play().then(() => {
            console.log("Sound played successfully.");
        }).catch(error => {
            console.error("Error playing sound:", error);
            alert("Error playing sound: " + error.message); // Debugging alert to show errors
        });
    } catch (e) {
        console.error("Error initializing audio:", e);
        alert("Error initializing audio: " + e.message); // Debugging alert to show initialization errors
    }
}

function addTextChangeListener(button) {
    const textObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const currentText = button.textContent.trim();
            if (currentText.includes("Turning in") || currentText.includes("Marking as done")) {
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

    const observer = new MutationObserver(checkForButton);
    observer.observe(document.body, { childList: true, subtree: true });

    checkForButton();
}

window.addEventListener('load', function() {
    if (window.location.href.includes('classroom.google.com')) {
        detectGoogleClassroomSubmission();
    }
});

function addClickListener(button) {
    button.addEventListener('click', () => {
        playSound();
    });
}

function detectBrightspaceSubmission() {
    console.log("Brightspace detection script loaded.");

    function addOnClickToBrightspaceButtons() {
        const buttons = document.querySelectorAll('button, div[role="button"]');
        buttons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            if (buttonText.includes("submit") || 
                buttonText.includes("done") || 
                buttonText.includes("mark as complete") || 
                buttonText.includes("upload") || 
                buttonText.includes("save") || 
                buttonText.includes("turn in") || 
                buttonText.includes("submit quiz") || 
                buttonText.includes("post")) {
                
                console.log("Brightspace submission button detected:", buttonText);
                addClickListener(button);  // Add the click listener to play sound
            }
        });
    }

    const observer = new MutationObserver(() => {
        console.log("DOM changed, checking for new Brightspace buttons...");
        addOnClickToBrightspaceButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addOnClickToBrightspaceButtons();
}

window.addEventListener('load', function() {
    if (window.location.href.includes('brightspace') || window.location.href.includes('d2l')) {
        detectBrightspaceSubmission();
    }
});
