const repo = 'Steam-markdown-preview';

async function StartData() {
    if (sessionStorage.getItem('Fetched') == null)
        await Setup();
    ChangeValues();
}

async function Setup()
{
    sessionStorage.setItem('Fetched', true)
    const data = await FetchURL(`https://api.github.com/repos/Juzlus/${repo}`);
    const commits = await FetchURL(`https://api.github.com/repos/Juzlus/${repo}/commits`);
    if(!data || !commits) return;

    sessionStorage.setItem('FileSize', `${data.size} KB`);
    sessionStorage.setItem('Changes', `${commits.length} Changes Notes <span class="change_note_link"><a>( view )</a></span>`);
    sessionStorage.setItem('PostedDate', `${formatDate(new Date(data.created_at))}`);
    sessionStorage.setItem('UpdatedDate', `${formatDate(new Date(data.updated_at))}`);

    sessionStorage.setItem('Collections', `${data.forks} collections`);
    sessionStorage.setItem('UniqueVisitors', data.network_count);
    sessionStorage.setItem('CurrentSubscribers', data.watchers_count);
    sessionStorage.setItem('CurrentFavorites', data?.stargazers_count);

    sessionStorage.setItem('AuthorAvatar', data?.owner?.avatar_url);
}

function ChangeValues()
{
    document.getElementById("FileSize").innerText = sessionStorage.getItem('FileSize') || '0 KB';
    document.getElementById("Changes").innerHTML = sessionStorage.getItem('Changes') || '0 Changes Notes <span class="change_note_link"><a>( view )</a></span>';
    document.getElementById("PostedDate").innerText = sessionStorage.getItem('PostedDate') || '1 Jan, 1970 @ 0:00am';
    document.getElementById("UpdatedDate").innerText = sessionStorage.getItem('UpdatedDate') || '1 Jan, 1970 @ 0:00am';

    document.getElementById("Collections").innerText = sessionStorage.getItem('Collections') || '0 collections';
    document.getElementById("UniqueVisitors").innerText = sessionStorage.getItem('UniqueVisitors') || 0;
    document.getElementById("CurrentSubscribers").innerText = sessionStorage.getItem('CurrentSubscribers') || 0;
    document.getElementById("CurrentFavorites").innerText = sessionStorage.getItem('CurrentFavorites') || 0;

    document.getElementById("AuthorAvatar").src = sessionStorage.getItem('AuthorAvatar') || 'https://avatars.githubusercontent.com/u/41649887?v=4';
}

function FetchURL(url)
{
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        })
        .then(response => {
            if (!response.ok)
                throw new Error('Network response was not ok');
            return response.json();
        })
        .catch(error => console.error('Error:', error));
}

function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${day} ${month}, ${year} @ ${hours}:${minutesStr}${ampm}`;
}