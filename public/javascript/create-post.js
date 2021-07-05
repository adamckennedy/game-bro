async function newPostHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const body = document.querySelector('#post-content').value.trim();

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            user_id,
            post_url,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }
        else {
            alert(response.statusText);
        }
    }

    document.querySelector('#create-new-post-btn').addEventListener('click', newPostHandler);
    //document.querySelector('.new-post-form').addEventListener('submit', newPostHandler);