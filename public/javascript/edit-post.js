async function putPostHandler(event) {
    event.preventDefault();

    // const title = document.querySelector('#post-title').value.trim();
    // const post_content = document.querySelector('#post-content').value.trim();
    const title = document.querySelector('input[name="post-title"]').value;
    const post_content = document.querySelector('input[name="post-content"]').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`,  {
        method: 'put',
        body: JSON.stringify({
            title,
            post_content
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


    document.querySelector('#edit-post-btn').addEventListener('click', putPostHandler);
