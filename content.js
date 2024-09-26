function playSound() {
  try {
    const audioUrl = chrome.runtime.getURL("sound.mp3");
    if (!audioUrl) {
      throw new Error("Audio URL is invalid.");
    }

    const audio = new Audio(audioUrl);
    audio
      .play()
      .then(() => {
        console.log("Sound played successfully.");
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
        alert("Error playing sound: " + error.message); // Debugging alert to show errors
      });
  } catch (e) {
    console.error("Error initializing audio:", e);
    alert("Error initializing audio: " + e.message); // Debugging alert to show initialization errors
  }
}

// Ensure the script runs after the page is fully loaded
window.addEventListener("load", function () {
  detectSubmissionButtons();
});

function addClickListener(button) {
  button.addEventListener("click", () => {
    playSound();
  });
}

function detectSubmissionButtons() {
  console.log("Submission detection script loaded.");

  // Function to detect submission buttons and log their presence
  function logButtonPresence() {
    // Select all possible buttons related to submission actions
    const buttons = document.querySelectorAll('button, div[role="button"]');
    console.log("Scanning for submission buttons...");

    buttons.forEach((button) => {
      const buttonText = button.textContent.trim().toLowerCase();

      // Check if the button text is related to submission actions
      if (
        // brightspace/d2l buttons
        buttonText.includes("submit") ||
        buttonText.includes("done") ||
        buttonText.includes("mark as complete") ||
        buttonText.includes("upload") ||
        buttonText.includes("save") ||
        buttonText.includes("turn in") ||
        buttonText.includes("submit quiz") ||
        buttonText.includes("post") ||
        // google classroom buttons
        buttonText.includes("turn in") ||
        buttonText.includes("mark as done") ||
        // canvas buttons
        buttonText.includes("submit assignment") ||
        buttonText.includes("mark as done") ||
        buttonText.includes("post reply")
      ) {
        // Exclude "unsubmit" actions
        if (!buttonText.includes("unsubmit")) {
          // Log button presence
          console.log("Submission button detected on the page:", buttonText);
          addClickListener(button); // Add the listener for any text changes
        }
      }
    });
  }

  // Observe DOM changes for dynamic content
  const observer = new MutationObserver(logButtonPresence);
  observer.observe(document.body, { childList: true, subtree: true });

  logButtonPresence(); // Initial check for buttons
}

// Ensure the script runs after the page is fully loaded
window.addEventListener("load", function () {
  detectSubmissionButtons();
});
