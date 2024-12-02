const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'burner-reagan-web-game';
const REPO_NAME = 'WebRTC-Game';
const TOKEN = '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';

async function pushToGitHub(filePath, content) {
    const url = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Game state update',
            content: btoa(content),
        }),
    });
    if (response.ok) {
        console.log('Game state pushed to GitHub.');
    } else {
        console.error('Failed to push to GitHub:', await response.text());
    }
}

async function pullFromGitHub(filePath) {
    const url = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: { 'Authorization': `token ${TOKEN}` },
    });
    if (response.ok) {
        const data = await response.json();
        return atob(data.content);  // Decode base64 content
    } else {
        console.error('Failed to pull from GitHub:', await response.text());
        return null;
    }
}

export { pushToGitHub, pullFromGitHub };
