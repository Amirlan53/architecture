(function() {

    addNavigation();
    loadTopBuildings();
    
    function addNavigation() {
        var active = {
            main: false,
            gallery: false
        };
        if (window.location.href.indexOf("main.html") !== -1) {
            active.main = true;
        } else if (window.location.href.indexOf("gallery.html") !== -1) {
            active.gallery = true;
        }
        var html = "" +
            "<nav id=\"menu\" class=\"navbar navbar-expand-lg navbar-dark\">" +
            "    <a href=\"/pages/main.html\" class=\"navbar-brand\">" +
            "        <img src=\"/img/lasto4kajpg.jpg\" width=\"40\" height=\"40\" alt=\"логотип\">" +
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
            "        </ul>" +
            (!checkIfLoggedIn() ?
                "        <span class='auth' onclick='goToPage(\"/login\")'>Войти</span>" +
                "       <span class='auth' onclick='goToPage(\"/registration\")'>Регистрация</span>" :
                "       <span class='auth' onclick='goToPage(\"/logout\")'>Выйти</span>") +
            "    </div>" +
            "</nav>";
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = html + body.innerHTML;
    }
    canComment();
    
})();

var record, user;

function like() {
    if (record) {
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
                url: window.location.href,
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
    if (!checkIfLoggedIn()) {
        if (commentContainer != null) {
            commentContainer.innerHTML = "" +
                "<a href='/login'>" +
                "Авторизуйтесь " +
                "</a>" +
                "или " +
                "<a href='/registration'>" +
                "зарегистрируйтесь " +
                "</a>" +
                "для оставления комментариев."
        }
    } else {
        record = loadRecords();
        if (record && record.length) {
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
            html += "</div>" +
                "<div class='form-group'>" +
                "<textarea class='form-control' name=\"text\" id='comment'></textarea>" +
                "<button onclick='addComment()' class='btn btn-light float-right t-25'>Добавить</button>" +
                "</div>";
            commentContainer.innerHTML = html;
        }
    }

}

function addComment() {

    var comment = document.getElementById("comment");
    if (comment != null) {
        var usernameResponse = getQuery("/security/username");
        var obj = {
            author: usernameResponse["username"],
            text: comment.value,
            url: window.location.href
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

    if (checkIfLoggedIn()) {
        console.log("here");
        return getQuery("/comment?url=" + window.location.href);
    } else {
        alert("Not logged in");
    }

}

function loadRecords() {

    if (checkIfLoggedIn()) {
        return getQuery("/record?url=" + window.location.href);
    } else {
        alert("Not logged in");
    }

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
                    "<span style='display: table-cell;vertical-align: top;padding-left: 5px;'>" + getNameFromUrl(items[i].url) + "</span>" +
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
