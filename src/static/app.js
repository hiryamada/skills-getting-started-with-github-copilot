document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Render activities
      renderActivities(activities);

      // Populate select dropdown
      activitySelect.innerHTML = "";
      Object.keys(activities).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Function to render activities
  function renderActivities(activities) {
    activitiesList.innerHTML = "";

    Object.entries(activities).forEach(([name, info]) => {
      const card = document.createElement("div");
      card.className = "activity-card";

      const spotsLeft = info.max_participants - info.participants.length;

      card.innerHTML = `
        <h4>${name}</h4>
        <p>${info.description}</p>
        <p><strong>Schedule:</strong> ${info.schedule}</p>
        <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
      `;

      // Participants section
      const participantsDiv = document.createElement("div");
      participantsDiv.className = "participants-list";
      const title = document.createElement("div");
      title.className = "participants-list-title";
      title.textContent = "Participants:";
      participantsDiv.appendChild(title);

      const ul = document.createElement("ul");
      if (info.participants && info.participants.length > 0) {
        info.participants.forEach(email => {
          const li = document.createElement("li");
          li.textContent = email;
          ul.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "No participants yet";
        ul.appendChild(li);
      }
      participantsDiv.appendChild(ul);

      card.appendChild(participantsDiv);

      activitiesList.appendChild(card);
    });
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
