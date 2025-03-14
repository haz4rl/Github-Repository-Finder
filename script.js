async function fetchRandomRepo() {
    const language = document.getElementById("language").value;
    const statusMessage = document.getElementById("status-message");
    const repoContainer = document.getElementById("repo-container");

    // Reset UI
    statusMessage.className = "message hidden";
    repoContainer.classList.add("hidden");

    if (!language) {
        statusMessage.textContent = "Please select a language";
        statusMessage.className = "message error";
        return;
    }

    statusMessage.textContent = "Loading, please wait...";
    statusMessage.className = "message loading";

    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&per_page=100`);
        const { items } = await res.json();

        if (!items || items.length === 0) throw new Error("No repositories found.");

        const repo = items[Math.floor(Math.random() * items.length)];

        repoContainer.innerHTML = `
            <div class="repo-card">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || "No description available."}</p>
                <div class="stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>🛠️ ${repo.open_issues_count}</span>
                </div>
                <button class="refresh-btn" onclick="fetchRandomRepo()">Refresh</button>
            </div>
        `;

        repoContainer.classList.remove("hidden");
        statusMessage.className = "message hidden";

    } catch (error) {
        statusMessage.textContent = "Error fetching repositories";
        statusMessage.className = "message error";
        repoContainer.innerHTML = `<button class="retry-btn" onclick="fetchRandomRepo()">Click to retry</button>`;
        repoContainer.classList.remove("hidden");
    }
}
