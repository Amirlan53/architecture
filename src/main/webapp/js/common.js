(function() {

    addNavigation();
    loadTopBuildings();
    latestComments();
    getMessages();
    setMapProps();

    function setMapProps() {
        if (document.getElementById("map") != null) {
            document.getElementById("map").style.width=document.getElementById("map").clientWidth;
            document.getElementById("map").style.minHeight="500px";
        }
    }

    function addNavigation() {
        var active = {
            main: false,
            gallery: false
        };
        if (window.location.href.indexOf("main.html") !== -1) {
            active.main = true;
        } else if (window.location.href.indexOf("gallery.html") !== -1) {
            active.gallery = true;
        } else if (window.location.href.indexOf("map.html") !== -1) {
            active.map = true;
        }
        var html = "" +
            "<div id='head-nav'>" +
            "   <h1>АРХИТЕКТУРА Г. НУР-СУЛТАН</h1>" +
            "</div>" +
            "<nav id=\"menu\" class=\"navbar navbar-expand-lg navbar-dark\">" +
            "    <a href=\"/pages/main.html\" class=\"navbar-brand\">" +
            "        <img src=\"/img/flag.png\" height=\"40\" alt=\"логотип\">" +
            "    </a>" +
            "    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\"" +
            "            aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">" +
            "        <span class=\"navbar-toggler-icon\"></span>" +
            "    </button>" +
            "    <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">" +
            "        <ul class=\"navbar-nav mr-auto\">" +
            "            <li class=\"nav-item " + (active.main === true ? "active" : "") + "\">" +
            "                <a href=\"/pages/main.html\" class=\"nav-link\">Главная</a>" +
            "            </li>" +
            "            <li class=\"nav-item " + (active.gallery === true ? "active" : "") + "\">" +
            "                <a href=\"/pages/gallery.html\" class=\"nav-link\">Изображения</a>" +
            "            </li>" +
            "            <li class=\"nav-item " + (active.map === true ? "active" : "") + "\">" +
            "                <a href=\"/pages/map.html\" class=\"nav-link\">Карта</a>" +
            "            </li>" +
            "        </ul>" +
            (!checkIfLoggedIn() ?
                "        <span class='auth' onclick='goToPage(\"/login\")'>Войти</span>" +
                "       <span class='auth' onclick='goToPage(\"/registration\")'>Регистрация</span>" :
                "       <span class='auth' onclick='goToPage(\"/pages/messages.html\")'>Поддержка</span>" +
                "       <span class='auth' onclick='goToPage(\"/logout\")'>Выйти</span>") +
            "    </div>" +
            "</nav>";
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = html + body.innerHTML;
    }
    canComment();
    
})();

var record, user;
var intervals = [];
var checkingMessages = false;

function like() {
    if (checkIfLoggedIn() && record) {
        console.log(record);
        var obj;
        if (record.length) {
            obj = record[0];

            if (!doesCurrLiked()) {
                obj.likes = obj.likes ? obj.likes + 1 : 1;
            } else {
                obj.likes = obj.likes ? obj.likes - 1 : 0;
            }
        } else {
            obj = {
                url: window.location.pathname+window.location.search,
                likes: 1
            };
        }
        postQuery("/record", obj);
        record = loadRecords();
        var likeNum = record[0].likes;
        if (document.getElementById("likeNum")) {
            document.getElementById("likeNum").innerText = likeNum;
            if (doesCurrLiked()) {
                document.getElementById("likeNum").parentElement.style.color = "red";
            } else {
                document.getElementById("likeNum").parentElement.style.color = "black";
            }
        }
    }
}

function doesCurrLiked() {
    return record && record[0] && record[0].whoLiked && record[0].whoLiked.indexOf(user) !== -1;
}

function canComment() {

    var commentContainer = document.getElementById("comment-container");
    record = loadRecords();
    if (record && record.length) {
        var likeNum = record[0].likes;
        if (document.getElementById("likeNum")) {
            document.getElementById("likeNum").innerText = likeNum;
            if (checkIfLoggedIn() && doesCurrLiked()) {
                document.getElementById("likeNum").parentElement.style.color = "red";
            } else {
                document.getElementById("likeNum").parentElement.style.color = "black";
            }
        }
    }
    if (!checkIfLoggedIn()) {
        if (commentContainer != null) {
            addCommentsHtmlToPage(commentContainer, false);
        }
    } else {
        addCommentsHtmlToPage(commentContainer, true);
    }

}

function addCommentsHtmlToPage(commentContainer, logged) {
    if (commentContainer != null) {
        var html = "" +
            "<h4>Комментарии</h4>" +
            "   <div style=\"padding: 5px;\">";
        var comments = loadComments();
        for (var i = 0; i < comments.length; i++) {
            var dt = new Date(comments[i]["date"]);
            html += "" +
                "<div style=\"font-weight: bold;\">" +
                comments[i]["author"] +
                "   <span style=\"font-weight: normal;font-size: smaller;color: grey;\">" +
                dt.toLocaleDateString() + " " + dt.toLocaleTimeString() +
                "   </span>" +
                "</div>" +
                "<div>" +
                comments[i]["text"] +
                "</div>";
        }
        if (logged) {
            html += "</div>" +
                "<div class='form-group'>" +
                "<textarea class='form-control' name=\"text\" id='comment'></textarea>" +
                "<button onclick='addComment()' class='btn btn-light float-right t-25'>Добавить</button>" +
                "</div>";
        } else {
            html+= "<a href='/login'>" +
                "Авторизуйтесь " +
                "</a>" +
                "или " +
                "<a href='/registration'>" +
                "зарегистрируйтесь " +
                "</a>" +
                "для оставления комментариев.";
        }
        commentContainer.innerHTML = html;
    }
}

function latestComments() {
    var commentContainer = document.getElementById("comment-latest");
    if (commentContainer != null) {
        var latest = getLatestComments();
        var xhr= new XMLHttpRequest();
        xhr.open('GET', '/pages/latest-comments.html', true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want
            document.getElementById('comment-latest').innerHTML= this.responseText;
        };
        xhr.send();
        setTimeout(function() {
            if (document.getElementById("latest-comments")) {
                var items = latest;
                var html = "<div><h4>Последние комментарии</h4>";
                for (var i = 0; i < items.length; i++) {
                    var dt = new Date(items[i]["date"]);
                    html += "<hr style='margin-bottom: 2px;' />" +
                        "<div>" +
                        "<div style=\"font-weight: bold;\">" +
                        items[i]["author"] +
                        "   <span style=\"font-weight: normal;font-size: smaller;color: grey;\">" +
                        dt.toLocaleDateString() + " " + dt.toLocaleTimeString() +
                        "   </span>" +
                        "</div>" +
                        "<div>" +
                        items[i]["text"] +
                        "</div>" +
                        "<div>" +
                        "<a href='" + items[i]["url"] + "' style='font-size: 12px;color: #73b1f3'>Посмотреть</a>" +
                        "</div>" +
                        "</div>";
                }
                html += "</div>"
                document.getElementById("latest-comments").innerHTML = html;
            }
        }, 1000);
    }
}

function addComment() {

    var comment = document.getElementById("comment");
    if (comment != null) {
        var usernameResponse = getQuery("/security/username");
        var obj = {
            author: usernameResponse["username"],
            text: comment.value,
            url: window.location.pathname+window.location.search
        };
        postQuery("/comment", obj);
        canComment();
    }

}

function goToPage(page) {
    window.location.href = page;
}

function postQuery(url, body) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(body));
    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status !== 200) {
        // обработать ошибку
        console.error( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        return "Error";
    } else {
        // вывести результат
        return JSON.parse(xhr.response)["response"];
        /*createList(comments, document.getElementsByTagName("body")[0]);*/
    }
}

function getQuery(url) {
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    xhr.open('GET', url, false);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status !== 200) {
        // обработать ошибку
        console.error( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        return "Error";
    } else {
        // вывести результат
        return JSON.parse(xhr.response)["response"];
        /*createList(comments, document.getElementsByTagName("body")[0]);*/
    }
}

function checkIfLoggedIn() {

    var response = getQuery("/security/isLogged");
    user = response["username"];
    return  response["val"] === true;

}

function loadComments() {

    return getQuery("/comment?url=" + encodeURI(window.location.pathname+window.location.search));

}

function getLatestComments() {

    return getQuery("/comment/latest");

}

function loadRecords() {

    return getQuery("/record?url=" + window.location.pathname+window.location.search);

}

function loadTopBuildings() {
    if (!document.getElementById("topBuildings")) {
        return;
    }
    var xhr= new XMLHttpRequest();
    xhr.open('GET', '/pages/top-buildings.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        document.getElementById('topBuildings').innerHTML= this.responseText;
    };
    xhr.send();
    var topRecords = getQuery("/record/all");
    setTimeout(function() {
        if (document.getElementById("records")) {
            var items = topRecords["content"];
            var html = "<div><h4>Самые рейтинговые места</h4>";
            for (var i = 0; i < items.length; i++) {
                html += "<hr style='margin-bottom: 2px;' /><div>" +
                    "<span style='font-size: 26px;color: grey;display: table-cell;vertical-align: top;line-height: 1'>" + (i+1) +
                    "</span>" +
                    "<span style='display: table-cell;vertical-align: top;padding-left: 5px;'>" +
                    "   <a href='" +
                    items[i].url +"' >" + getNameFromUrl(items[i].url) + "</a></span>" +
                    "</div>";
            }
            html += "</div>"
            document.getElementById("records").innerHTML = html;
        }
    }, 1000);
}

function getNameFromUrl(url) {
    if (url.indexOf("ak-orda") !== -1) {
        return "Резиденция президента «Ак орда»";
    } else if (url.indexOf("astana-opera") !== -1) {
        return "Театр «Астана Опера»";
    } else if (url.indexOf("atameken") !== -1) {
        return "Этно-мемориальный комплекс «Атамекен»";
    } else if (url.indexOf("baiterek") !== -1) {
        return "Монумент «Байтерек»";
    } else if (url.indexOf("concert") !== -1) {
        return "Центральный концертный зал «Казахстан»";
    } else if (url.indexOf("drama-theatre") !== -1) {
        return "Русский драматический театр им. М. Горького";
    } else if (url.indexOf("duman") !== -1) {
        return "Развлекательный центр «Думан»";
    } else if (url.indexOf("expo") !== -1) {
        return "МФЦА (EXPO)";
    } else if (url.indexOf("first-president") !== -1) {
        return "Музей первого президента Казахстана";
    } else if (url.indexOf("independency") !== -1) {
        return "Дворец Независимости";
    } else if (url.indexOf("kazakh-el") !== -1) {
        return "Монумент Казак Ели";
    } else if (url.indexOf("khan-shatyr") !== -1) {
        return "Хан Шатыр";
    } else if (url.indexOf("moscow") !== -1) {
        return "Бизнес-центр «Москва»";
    } else if (url.indexOf("national-museum") !== -1) {
        return "Национальный музей Республики Казахстан";
    } else if (url.indexOf("nurzhol") !== -1) {
        return "Бульвар Нуржол";
    } else if (url.indexOf("opera-theatre") !== -1) {
        return "Национальный театр оперы и балета";
    } else if (url.indexOf("peace") !== -1) {
        return "Дворец мира и согласия";
    } else if (url.indexOf("shabyt") !== -1) {
        return "Дворец творчества Шабыт";
    }
}

function getMessages(name) {
    setTimeout(function() {
        var messagesContainer = document.getElementById("messages-container");
        if (messagesContainer != null) {
            var author = name;
            var commentArea = document.getElementById("commentArea");
            if (!name) {
                author = user;
            }
            var messagesResponse = getQuery("/message/user?name=" + (name ? name : user));
            var html = "<div class='card-header'><h4>Диалог</h4></div><div class='card-body' id='bodyOfDialog' style='max-height: 800px;overflow-y: auto'>";
            for (var i = 0; i < messagesResponse.length; i++) {
                html+= "<div style='clear: both'><span class='mes' " + (messagesResponse[i]["admin"] ? "style='float:right;clear:both;'" : "") + ">" +
                    "   <div class='mesAuthor'>" + (messagesResponse[i]["admin"] || messagesResponse[i]["author"]) + "</div>" +
                    "   <div class='mesText'>" + messagesResponse[i]["text"] + "</div>" +
                    "   <div class='mesDate'>" + new Date(messagesResponse[i]["date"]).toLocaleString() + "</div>" +
                    "</span></div>";
            }
            html+="</div>";
            messagesContainer.innerHTML = html;
            var exampleModal = document.getElementById("exampleModal");
            if (exampleModal && !exampleModal.getAttribute("aria-hidden") && !document.added) {
                if (commentArea.parentElement.innerHTML.indexOf("button") === -1) {
                    commentArea.parentElement.innerHTML = commentArea.parentElement.innerHTML +
                        "<button onclick='sendMessage(" + "\"" + author + "\"" + ")'>Отправить</button>";
                } else {
                    commentArea.parentElement.innerHTML = commentArea.parentElement.innerHTML
                            .substring(0, commentArea.parentElement.innerHTML.indexOf("button") - 1) +
                        "<button onclick='sendMessage(" + "\"" + author + "\"" + ")'>Отправить</button>";
                }
                document.added = true;
            }
            if (name) {
                checkMessages(name);
            }
            gotoBottom("bodyOfDialog");

        }
    }, 1000);
}

function checkMessages(name) {
    if (!checkingMessages) {
        checkingMessages = true;
        if (!intervals) {
            intervals = [];
        }
        var interval = setInterval(function () {
            getMessages(name);
        }, 3000);
        intervals.push(interval);
    }
    checkingMessages = true;
}

window.onbeforeunload = function(){
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
};

function sendMessage(to) {
    var textareaContainer = document.getElementById("commentArea");
    if (textareaContainer != null) {
        var value = textareaContainer.value;
        if (value && value != "") {
            var obj = {
                author: to ? to : user,
                text: value
            };
            postQuery("/message", obj);
            getMessages(to);
        }
        textareaContainer.value = "";
    }
}

var allUsers = [];
function isAdminRead(name, id) {
    var response = getQuery("/message/isAdminRead?name=" + name);
    var element = document.getElementById(id);
    if (element) {
        element.innerHTML = "<button type=\"button\" class=\"btn btn-primary\"\n" + (response===false ? " style='background:orange' title='Есть непрочитанные сообщения'" : "") +
            "                              onclick=\"getMessages('" + name + "')\"\n" +
            "                              data-toggle=\"modal\" data-target=\"#exampleModal\">\n" +
            "                        Диалог\n" +
            "                      </button>";
        var exist = false;
        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].author == name) {
                exist = true;
            }
        }
        if (!exist) {
            allUsers.push({author: name, id: id});
        }
    }

}

function updateUsersNotify() {
    for (var i = 0; i < allUsers.length; i++) {
        isAdminRead(allUsers[i].author, allUsers[i].id);
    }
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
    checkingMessages = false;
    document.added = false;

}

function gotoBottom(id){
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}