async function newPostHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const post_content = document.querySelector('#post-content').value.trim();
    

    const response = await fetch('/api/posts',  {
        method: 'post',
        body: JSON.stringify({
            title,
            post_content
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
      //  document.location.replace('/dashboard');
      document.location.replace('/');
    }
        else {
            alert(response.statusText);
        }
    }

    document.querySelector('#create-new-post-btn').addEventListener('click', newPostHandler);
    //document.querySelector('.new-post-form').addEventListener('submit', newPostHandler);