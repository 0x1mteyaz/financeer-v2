document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('forumUsername');
    if (!username) {
        window.location.href = 'username.html';
    } else {
        loadThreads();
        initializeForum();
    }
});

function loadThreads() {
    const threads = JSON.parse(localStorage.getItem('threads')) || [];
    threads.forEach((thread, index) => {
        createThreadElement(thread.title, thread.content, index);
    });
}

function createThreadElement(title, content, index) {
    const table = document.getElementById('threadTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.insertCell(0).textContent = title;
    row.cells[0].style.cursor = 'pointer';
    row.cells[0].addEventListener('click', () => openThreadPage(title, content, index));
    row.insertCell(1).textContent = content.substring(0, 50) + '...'; // Content preview
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteThread(row, index);
    row.insertCell(2).appendChild(deleteButton);
}

function deleteThread(row, index) {
    row.remove(); // Remove the row from the table
    let threads = JSON.parse(localStorage.getItem('threads')) || [];
    threads.splice(index, 1); // Remove the thread from the array
    localStorage.setItem('threads', JSON.stringify(threads)); // Update local storage
    // Reload threads to update indices for deletion
    document.getElementById('threadTable').getElementsByTagName('tbody')[0].innerHTML = '';
    loadThreads();
}

function createThread() {
    const title = document.getElementById('threadTitle').value;
    const content = document.getElementById('threadContent').value;
    if (title && content) {
        const thread = { title, content, replies: [] };
        const threads = JSON.parse(localStorage.getItem('threads')) || [];
        threads.push(thread);
        localStorage.setItem('threads', JSON.stringify(threads));
        document.getElementById('threadTable').getElementsByTagName('tbody')[0].innerHTML = ''; // Clear existing threads to reload with new indices
        loadThreads(); // Reload threads to include the new one
    } else {
        alert('Please fill in all fields.');
    }
}

function openThreadPage(title, content, index) {
    const threadWindow = window.open('', '_blank', 'width=400,height=600');
    const threads = JSON.parse(localStorage.getItem('threads')) || [];
    const thread = threads[index];
    const repliesHtml = thread.replies.map(reply => `<p>${reply.username}: ${reply.content}</p>`).join('');

    threadWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h4 { color: #333; }
                #replies { margin-top: 20px; }
                textarea { width: 100%; height: 50px; margin-top: 10px; }
                button { padding: 10px; }
            </style>
        </head>
        <body>
            <h4>${title}</h4>
            <p>${content}</p>
            <div id="replies">
                <h5>Replies</h5>
                ${repliesHtml}
            </div>
            <textarea id="replyContent" placeholder="Your reply..."></textarea>
            <button onclick="postReply()">Post Reply</button>
            <script>
                const postReply = () => {
                    const replyContent = document.getElementById('replyContent').value;
                    const username = localStorage.getItem('forumUsername');
                    if (replyContent && username) {
                        const repliesDiv = document.getElementById('replies');
                        const reply = document.createElement('p');
                        reply.textContent = username + ': ' + replyContent;
                        repliesDiv.appendChild(reply);
                        document.getElementById('replyContent').value = '';
                        // Save reply to local storage
                        const threads = JSON.parse(localStorage.getItem('threads'));
                        threads[${index}].replies.push({ username, content: replyContent });
                        localStorage.setItem('threads', JSON.stringify(threads));
                    } else {
                        alert('Please enter a reply.');
                    }
                }
                document.currentScript.parentNode.insertBefore(document.createElement('script'), document.currentScript).textContent = postReply.toString();
            </script>
        </body>
        </html>
    `);
    threadWindow.document.close();
}


function initializeForum() {
    document.getElementById('searchBox').addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase();
        // Implement search functionality based on user input
        filterThreads(searchQuery);
    });
}

function filterThreads(query) {
    const threads = JSON.parse(localStorage.getItem('threads')) || [];
    const tbody = document.getElementById('threadTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear current threads
    threads.filter(thread => thread.title.toLowerCase().includes(query) || thread.content.toLowerCase().includes(query))
           .forEach((thread, index) => createThreadElement(thread.title, thread.content, index));
}
