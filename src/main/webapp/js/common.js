(function() {

    addNavigation();
    loadTopBuildings();
    latestComments();
    getMessages();
    setMapProps();
    addPersonal();

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
            "   <h1>" + (localStorage.getItem('lg')==="ru" ? "АРХИТЕКТУРНЫЙ ПОРТАЛ Г. НУР-СУЛТАН" : (localStorage.getItem('lg')==="kz" ? "Нұр-сұлтан қаласының сәулет порталы".toUpperCase() : "ARCHITECTURAL PORTAL OF NUR-SULTAN")) + "</h1>" +
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
            "                <a href=\"/pages/main.html\" class=\"nav-link\">" + (localStorage.getItem('lg')==="ru" ? "Главная" : (localStorage.getItem('lg')==="kz" ? "Басты бет" : "Main")) + "</a>" +
            "            </li>" +
            "            <li class=\"nav-item " + (active.gallery === true ? "active" : "") + "\">" +
            "                <a href=\"/pages/gallery.html\" class=\"nav-link\">" + (localStorage.getItem('lg')==="ru" ? "Изображения" : (localStorage.getItem('lg')==="kz" ? "Суреттер" : "Images")) + "</a>" +
            "            </li>" +
            "            <li class=\"nav-item " + (active.map === true ? "active" : "") + "\">" +
            "                <a href=\"/pages/map.html\" class=\"nav-link\">" + (localStorage.getItem('lg')==="ru" ? "Карта" : (localStorage.getItem('lg')==="kz" ? "Карта" : "Map")) + "</a>" +
            "            </li>" +
            "        </ul>" +
            "<div class=\"dropdown\">\n" +
            "  <button style='    background: #79baff;\n" +
            "    color: white;' class=\"btn btn-light dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
            "    " + (localStorage.getItem('lg')==="ru" ? "Язык" : (localStorage.getItem('lg')==="kz" ? "Тіл" : "Language")) + "\n" +
            "  </button>\n" +
            "  <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n" +
            "    <a class=\"dropdown-item\" onclick='selectLang(\"ru\")'>Русский</a>\n" +
            "    <a class=\"dropdown-item\" onclick='selectLang(\"kz\")'>Қазақша</a>\n" +
            "    <a class=\"dropdown-item\" onclick='selectLang(\"en\")'>English</a>\n" +
            "  </div>\n" +
            "</div>" +
            (!checkIfLoggedIn() ?
                "        <span class='auth' onclick='goToPage(\"/login\")'>" + (localStorage.getItem('lg')==="ru" ? "Войти" : (localStorage.getItem('lg')==="kz" ? "Кіру" : "Enter")) + "</span>" +
                "       <span class='auth' onclick='goToPage(\"/registration\")'>" + (localStorage.getItem('lg')==="ru" ? "Регистрация" : (localStorage.getItem('lg')==="kz" ? "Тіркеу" : "Registration")) + "</span>" :
                "       <span class='auth' onclick='goToPage(\"/pages/messages.html\")'>" + (localStorage.getItem('lg')==="ru" ? "Поддержка" : (localStorage.getItem('lg')==="kz" ? "Қолдау" : "Support")) + "</span>" +
                "       <span class='auth' onclick='goToPage(\"/pages/personal.html\")'>" + (localStorage.getItem('lg')==="ru" ? "Личный кабинет" : (localStorage.getItem('lg')==="kz" ? "Жеке кабинет" : "Private")) + "</span>" +
                "       <span class='auth' onclick='goToPage(\"/logout\")'>" + (localStorage.getItem('lg')==="ru" ? "Выйти" : (localStorage.getItem('lg')==="kz" ? "Шығу" : "Log off")) + "</span>") +
            "    </div>" +
            "</nav>";
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = html + body.innerHTML;
    }
    canComment();
    
})();

var record, user;
var isAdmin = false;
var intervals = [];
var checkingMessages = false;
var lang = "ru";

function selectLang(lg) {
    lang = lg;
    localStorage.setItem('lg', lang);
    getQuery("/security/setLang?lang=" + lg);
    goToPage(window.location.href);
}

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
            "<h4>" + (localStorage.getItem('lg')==="ru" ? "Комментарии" : (localStorage.getItem('lg')==="kz" ? "Түсініктемелер" : "Comments")) + "</h4>" +
            "   <div style=\"padding: 5px;\">";
        var comments = loadComments();
        for (var i = 0; i < comments.length; i++) {
            var dt = new Date(comments[i]["date"]);
            html += "" +
                "<div style=\"font-weight: bold;\">" +
                ((comments[i]["firstName"] && comments[i]["lastName"]) ? (comments[i]["firstName"] + ' ' + comments[i]["lastName"]) : comments[i]["author"]) +
                "   <span style=\"font-weight: normal;font-size: smaller;color: grey;\">" +
                dt.toLocaleDateString() + " " + dt.toLocaleTimeString() +
                "   </span>";
            if (isAdmin || user === comments[i]["author"]) {
                html += "<span onclick='deleteComment(" + comments[i]["id"] + ")'>" +
                    "<svg class=\"bi bi-trash-fill\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                    "  <path fill-rule=\"evenodd\" d=\"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z\"/>\n" +
                    "</svg></span>";
            }
            html += "</div>" +
                "<div>" +
                comments[i]["text"] +
                "</div>";
        }
        if (logged) {
            html += "</div>" +
                "<div class='form-group'>" +
                "<textarea class='form-control' name=\"text\" id='comment'></textarea>" +
                "<button onclick='addComment()' class='btn btn-light float-right t-25'>" + (localStorage.getItem('lg')==="ru" ? "Добавить" : (localStorage.getItem('lg')==="kz" ? "Қосу" : "Add")) + "</button>" +
                "</div>";
        } else {
            html+= "<a href='/login'>" +
                "" + (localStorage.getItem('lg')==="ru" ? "Авторизуйтесь" : (localStorage.getItem('lg')==="kz" ? "Авторизацияланыңыз" : "Log in")) + " " +
                "</a>" +
                "" + (localStorage.getItem('lg')==="ru" ? "или" : (localStorage.getItem('lg')==="kz" ? "немесе" : "or")) + " " +
                "<a href='/registration'>" +
                "" + (localStorage.getItem('lg')==="ru" ? "зарегистрируйтесь" : (localStorage.getItem('lg')==="kz" ? "тіркеліңіз" : "register")) + " " +
                "</a>" +
                "" + (localStorage.getItem('lg')==="ru" ? "для оставления комментариев." : (localStorage.getItem('lg')==="kz" ? "пікір қалдыру үшін." : "to add comments.")) + "";
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
                var html = "<div><h4>" + (localStorage.getItem('lg')==="ru" ? "Последние комментарии" : (localStorage.getItem('lg')==="kz" ? "Соңғы пікірлер" : "Last comments")) + "</h4>";
                for (var i = 0; i < items.length; i++) {
                    var dt = new Date(items[i]["date"]);
                    html += "<hr style='margin-bottom: 2px;' />" +
                        "<div>" +
                        "<div style=\"font-weight: bold;\">" +
                        (items[i]["firstName"] && items[i]["lastName"] ? (items[i]["firstName"] + " " + items[i]["lastName"]) : (items[i]["name"])) +
                        "   <span style=\"font-weight: normal;font-size: smaller;color: grey;\">" +
                        dt.toLocaleDateString() + " " + dt.toLocaleTimeString() +
                        "   </span>" +
                        "</div>" +
                        "<div>" +
                        items[i]["text"] +
                        "</div>" +
                        "<div>" +
                        "<a href='" + items[i]["url"] + "' style='font-size: 12px;color: #73b1f3'>" + (localStorage.getItem('lg')==="ru" ? "Посмотреть" : (localStorage.getItem('lg')==="kz" ? "Көру" : "See")) + "</a>" +
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
    if (response["roles"] && response["roles"].length) {
        if (response["roles"][0].authority === "ROLE_ADMIN") {
            isAdmin = true;
        }
    }
    return  response["val"] === true;

}

function isAdminUser() {
    return isAdmin;
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
    var mainBuildingsRow = document.getElementById("mainBuildings");
    var buils = getQuery("/building/all");
    var html = "";
    if (buils) {
        var arr = buils;
        for (var i = 0; i < arr.length; i++) {
            html += "<div class=\"col-12 col-md-6 col-lg-4\" onclick=\"goToPage('/building/" + arr[i].id + "')\">\n" +
                "                            <figure>\n" +
                "                                <p><img src=\"/building/" + arr[i].id + "/img\" alt=\"" + arr[i].name + "\" /></p>\n" +
                "                                <figcaption>" + (localStorage.getItem('lg')==="ru" ? arr[i].name : (localStorage.getItem('lg')==="kz" ? arr[i].kzName : arr[i].enName)) + "</figcaption>\n" +
                "                            </figure>\n" +
                "                        </div>";
        }
        mainBuildingsRow.innerHTML = html;
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
            var items = topRecords;
            var html = "<div><h4>" + (localStorage.getItem('lg')==="ru" ? "Самые рейтинговые места" : (localStorage.getItem('lg')==="kz" ? "Ең рейтингтік құрылыстар" : "Top rated places")) + "</h4>";
            for (var i = 0; i < items.length; i++) {
                html += "<hr style='margin-bottom: 2px;' /><div>" +
                    "<span style='font-size: 26px;color: grey;display: table-cell;vertical-align: top;line-height: 1'>" + (i+1) +
                    "</span>" +
                    "<span style='display: table-cell;vertical-align: top;padding-left: 5px;'>" +
                    "   <a href='" +
                    items[i].url +"' >" + items[i].buildingName + "</a></span>" +
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

function deleteBuilding(id) {
    postQuery("/building/remove?id=" + id, {});
    goToPage("/");
}

function deleteComment(id) {
    postQuery("/comment/delete/" + id, {});
    goToPage(window.location.href);
}

var allUsers = [];
function isAdminRead(name, id) {
    var response = getQuery("/message/isAdminRead?name=" + name);
    var element = document.getElementById(id);
    if (element) {
        element.innerHTML = "<button type=\"button\" class=\"btn btn-primary\"\n" + (response===false ? " style='background:orange' title='Есть непрочитанные сообщения'" : "") +
            "                              onclick=\"getMessages('" + name + "')\"\n" +
            "                              data-toggle=\"modal\" data-target=\"#exampleModal\">\n" +
            "                        " + (localStorage.getItem('lg')==="ru" ? "Диалог" : (localStorage.getItem('lg')==="kz" ? "Диалог" : "Talk")) + "\n" +
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

function createdBuilding() {
    setTimeout(function() {
        alert("Готово!");
        document.getElementById("fileUploadForm").reset();
    }, 1000);
}

function updatedPersonal() {
    setTimeout(function() {
        alert("Данные обновлены!");
        document.getElementById("fileUploadForm").reset();
    }, 1000);
}

/*function createBuilding() {
    var fileElement = document.getElementById("fileElement");
    var nameElement = document.getElementById("nameElement");
    var textElement = document.getElementById("textElement");
    var reader = new FileReader();
    reader.onload = function() {

        var arrayBuffer = this.result,
            array = new Uint8Array(arrayBuffer),
            arraySec = new Int8Array(arrayBuffer),
            binaryString = String.fromCharCode.apply(null, array);

        console.log(binaryString);
        console.log(StringToArrayBuffer(binaryString));
        var name = nameElement.value;
        var text = textElement.value;
        postQuery("/building/withImg", {
            name: name,
            text: text,
            image: binaryString
        });
        /!*var response = getQuery("/building/test");
        console.log(getQuery("/building/test"));
        console.log(StringToArrayBuffer(response[0]["image"]));
        var blob = new Blob( [ StringToArrayBuffer(response[0]["image"]) ], { type: "image/jpeg" } );
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL( blob );
        var img = document.querySelector( "#photo" );
        img.src = imageUrl;*!/

    };
    reader.readAsArrayBuffer(fileElement.files[0]);
}*/

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function ArrayBufferToString(buffer) {
    return BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
}

function StringToArrayBuffer(string) {
    return StringToUint8Array(string).buffer;
}

function BinaryToString(binary) {
    var error;

    try {
        return decodeURIComponent(escape(binary));
    } catch (_error) {
        error = _error;
        if (error instanceof URIError) {
            return binary;
        } else {
            throw error;
        }
    }
}

function StringToBinary(string) {
    var chars, code, i, isUCS2, len, _i;

    len = string.length;
    chars = [];
    isUCS2 = false;
    for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
        code = String.prototype.charCodeAt.call(string, i);
        if (code > 255) {
            isUCS2 = true;
            chars = null;
            break;
        } else {
            chars.push(code);
        }
    }
    if (isUCS2 === true) {
        return unescape(encodeURIComponent(string));
    } else {
        return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
    }
}

function StringToUint8Array(string) {
    var binary, binLen, buffer, chars, i, _i;
    binary = StringToBinary(string);
    binLen = binary.length;
    buffer = new ArrayBuffer(binLen);
    chars  = new Uint8Array(buffer);
    for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
        chars[i] = String.prototype.charCodeAt.call(binary, i);
    }
    return chars;
}

function insertAtCaret(areaId, text) {
    var txtarea = document.getElementById(areaId);
    if (!txtarea) {
        return;
    }

    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false));
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
    } else if (br == "ff") {
        strPos = txtarea.selectionStart;
    }

    var front = (txtarea.value).substring(0, strPos);
    var back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart('character', -txtarea.value.length);
        ieRange.moveStart('character', strPos);
        ieRange.moveEnd('character', 0);
        ieRange.select();
    } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }

    txtarea.scrollTop = scrollPos;
}

function addNewLine() {
    insertAtCaret("text", " @newLine@ ");
}
function addEndLine() {
    insertAtCaret("text", " @endLine@ ");
}

function addNewLineKz() {
    insertAtCaret("kzText", " @newLine@ ");
}
function addEndLineKz() {
    insertAtCaret("kzText", " @endLine@ ");
}

function addNewLineEn() {
    insertAtCaret("enText", " @newLine@ ");
}
function addEndLineEn() {
    insertAtCaret("enText", " @endLine@ ");
}

function addPersonal() {
    if (window.location.href.indexOf("personal") !== -1) {
        var item = getQuery("/userPersonal");
        var firstName = document.getElementById("firstName");
        var lastName = document.getElementById("lastName");
        firstName.value = item.firstName || "";
        lastName.value = item.lastName || "";

    }
}