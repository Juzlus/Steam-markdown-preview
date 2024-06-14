let highlightContent = null;
let isFocus = true;

//!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
const OPENED = "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z";
const CLOSED = "M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z";

function ChangeFocus() {
    let textarea = document.getElementById("workshopItemDescriptionRaw");

    textarea.classList.toggle('show-panel', isFocus);
    textarea.classList.toggle('hide-panel', !isFocus);

    let pathData = isFocus ? OPENED : CLOSED;
    document.getElementById("eyeSVG").innerHTML = `<path d="${pathData}"/>`;

    isFocus = !isFocus;
    localStorage.setItem('show', !isFocus);
}

function ChangeHeight(element) {
    element.style.height = '';
    element.style.height = `${element.scrollHeight}px`;
    UpdateDescription(element);
}

function UpdateDescription(element) {
    if (!highlightContent)
        highlightContent = document.getElementById("highlightContent");

    let content = element.value.trim();
    content = content.replace(/<([\s\S]*?)>/gi, '❬$1❭')
                    .replace(/<\/([\s\S]*?)>/gi, '❬/$1❭');


    while (content.toLowerCase().includes("[noparse]")) {
        let startIndex = content.toLowerCase().indexOf("[noparse]");
        let endIndex = content.indexOf('[/noparse]', startIndex);
        if (startIndex === -1 || endIndex === -1)
            break;

        let fullText = content.slice(startIndex, endIndex + 10);
        let innerText = content.slice(startIndex + 9, endIndex);
        let noparseText = innerText.replace(/\[(.*?)\]/gi, '[BEFORE_$1_AFTER]');
        content = content.replace(fullText, noparseText);
    }

    while (content.toLowerCase().includes("[url="))
    {
        let startIndex = content.toLowerCase().indexOf("[url=");
        let endIndex1 = content.indexOf("]", startIndex);
        let endIndex = content.toLowerCase().indexOf("[/url]", startIndex);

        if (startIndex == -1 || endIndex == -1 || endIndex1 == -1)
            break;

        let href = content.slice(startIndex + 5, endIndex1);
        let domain = href.split('/')[2];
        let message = content.slice(startIndex + 6 + href.length, endIndex).trim();

        let fullText = content.slice(startIndex, endIndex + 6);
        content = content.replace(fullText, `<a class="bb_link" href="${href} " target="_blank" rel=" noopener">${message}</a>${!domain || domain.includes("steamcommunity.com") ? '' : `<span class="bb_link_host">[${domain}]</span>`}`)
    }

    const replacements = {
        "\\[h1\\]([\\s\\S]*?)\\[\\/h1\\]": '<div class="bb_h1">$1</div>',
        "\\[h2\\]([\\s\\S]*?)\\[\\/h2\\]": '<div class="bb_h2">$1</div>',
        "\\[h3\\]([\\s\\S]*?)\\[\\/h3\\]": '<div class="bb_h3">$1</div>',
        "\\[b\\]([\\s\\S]*?)\\[\\/b\\]": '<b>$1</b>',
        "\\[u\\]([\\s\\S]*?)\\[\\/u\\]": '<u>$1</u>',
        "\\[i\\]([\\s\\S]*?)\\[\\/i\\]": '<i>$1</i>',
        "\\[strike\\]([\\s\\S]*?)\\[\\/strike\\]": '<span class="bb_strike">$1</span>',
        "\\[spoiler\\]([\\s\\S]*?)\\[\\/spoiler\\]": '<span class="bb_spoiler"><span>$1</span></span>',
        "\\[hr\\]": '<hr><br>',
        "\\[/hr\\]": '',
        "\\[code\\]([\\s\\S]*?)\\[\\/code\\]": '<div class="bb_code">$1</div>',
        "\\[list\\]([\\s\\S]*?)\\[\\/list\\]": '<ul class="bb_ul">$1</ul>',
        "\\[\\*\\]([\\s\\S]*?)\\n": '<li>$1</li>',
        "\\[olist\\]([\\s\\S]*?)\\[\\/olist\\]": '<ol>$1</ol>',
        "\\[table\\]([\\s\\S]*?)\\[\\/table\\]": '<div class="bb_table">$1</div>',
        "\\[tr\\]([\\s\\S]*?)\\[\\/tr\\]": '<div class="bb_table_tr">$1</div>',
        "\\[th\\]([\\s\\S]*?)\\[\\/th\\]": '<div class="bb_table_th">$1</div>',
        "\\[td\\]([\\s\\S]*?)\\[\\/td\\]": '<div class="bb_table_td">$1</div>',
        "\\[img\\]([\\s\\S]*?)\\[\\/img\\]": '<img src="$1" crossorigin="anonymous"></img>',
        "\\[quote=([\\s\\S]*?)\\]([\\s\\S]*?)\\[\\/quote\\]": '<blockquote class="bb_blockquote with_author"><div class="bb_quoteauthor">Originally posted by <b>$1</b>: </div> $2</blockquote>',
        "\\[BEFORE_(.*?)_AFTER\\]" : '[$1]',
        '[\\s\\S]https?:\/\/(\\S*?)(?! ")(\\s|$)': '<br><a href="https://$1">https://$1</a><br>',
        "\\n": '<br>',
        "</div><br>": '</div>',
        "<hr><br>": '<hr>',
        "<br><ol": '<ol',
        "<br><ul": '<ul',
        "</ul><br>": '</ul>',
        "</ol><br>": "</ol>",
        "</blockquote><br>": "</blockquote>"
    };

    content = Object.keys(replacements).reduce((acc, key) => {
        return acc.replace(new RegExp(key, 'gi'), replacements[key]);
    }, content);
    highlightContent.innerHTML = content;
}

function InsertStyleElement(i) {
    const tags = [
        '[h1] $1 [/h1]', '[h2] $1 [/h2]', '[h3] $1 [/h3]',
        '$1 [hr][/hr]', '[b] $1 [/b]', '[i] $1 [/i]',
        '[u] $1 [/u]', '[strike] $1 [/strike]', '[spoiler] $1 [/spoiler]',
        '$1\n[list]\n[*] First\n[*] Element\n[/list]', '$1\n[olist]\n[*] First\n[*] Element\n[/olist]',
        '[url=$1] Click me! [/url]',
        '[img] $1 [/img]',
        '[noparse] $1 [/noparse]', '[quote=author] $1 [/quote]', '[code] $1 [/code]',
        '$1\n[table]\n[tr]\n[th] Name [/th]\n[/tr]\n[tr]\n[td] Steam Markdown [/td]\n[/tr]\n[/table]'
    ];
    
    let textarea = document.querySelector("#workshopItemDescriptionRaw textarea");
    let startPosition = textarea.selectionStart;
    let endPosition = textarea.selectionEnd;
    let content = tags[i];
    textarea.value = insertText(textarea.value, startPosition, endPosition, content);
    UpdateDescription(textarea);
}

function insertText(text, start, end, newText) {
    newText = newText.replace("$1", text.slice(start, end));
    return text.slice(0, start) + newText + text.slice(end);
}

function SaveToStorage(element)
{
    localStorage.setItem('lastContent', element.value);
}

function LoadFromStorage()
{
    let textarea = document.querySelector("#workshopItemDescriptionRaw textarea");
    textarea.value = localStorage.getItem('lastContent');
    UpdateDescription(textarea);

    if (localStorage.getItem('show') != null)
        isFocus = (localStorage.getItem('show') === 'true');
    ChangeFocus();
}

window.onload = () => {
    LoadFromStorage();
    StartData();
}
