<%@ page import="kz.politech.architecture.model.User" %>
<%@ page import="java.util.List" %>
<%@ page import="kz.politech.architecture.controllers.SecurityController" %>
<%@ page import="java.util.Map" %>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%@ page import="org.springframework.security.core.userdetails.UserDetails" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Objects" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link href="${pageContext.request.contextPath}/css/custom.css" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/bootstrap.min.css">
  <title>Панель администратора</title>
  <script src="${pageContext.request.contextPath}/js/jquery-3.3.1.slim.min.js"></script>
</head>

<body style="background: #f7f7f7;">
<div>
    <%!
        String getLang() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                for (Map<String, String> user : SecurityController.languages) {
                    if (user.get(username) != null) {
                        String lang = user.get(username);
                        return lang;
                    }
                }
            }
            return "ru";
        }
        String addBtn() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Добавить";
            } else if (Objects.equals(lang, "kz")) {
                return "Қосу";
            } else {
                return "Add";
            }
        }
        String adminPanel() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Панель администратора";
            } else if (Objects.equals(lang, "kz")) {
                return "Әкімші панелі";
            } else {
                return "Admin panel";
            }
        }
        String userHandle() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Управление пользователями";
            } else if (Objects.equals(lang, "kz")) {
                return "Пайдаланушыларды басқару";
            } else {
                return "User management";
            }
        }
        String userName() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Имя пользователя";
            } else if (Objects.equals(lang, "kz")) {
                return "Пайдаланушы аты";
            } else {
                return "Username";
            }
        }
        String messages() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Сообщения";
            } else if (Objects.equals(lang, "kz")) {
                return "Хабарламалар";
            } else {
                return "Messages";
            }
        }
        String roles() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Роли";
            } else if (Objects.equals(lang, "kz")) {
                return "Рөлдері";
            } else {
                return "Roles";
            }
        }
        String removeBtn() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Удалить";
            } else if (Objects.equals(lang, "kz")) {
                return "Өшіру";
            } else {
                return "Remove";
            }
        }
        String addBuild() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Добавление новых сооружений";
            } else if (Objects.equals(lang, "kz")) {
                return "Жаңа ғимараттарды қосу";
            } else {
                return "Add new building";
            }
        }
        String buildName() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Наименование сооружения";
            } else if (Objects.equals(lang, "kz")) {
                return "Құрылыстың атауы";
            } else {
                return "Building name";
            }
        }
        String enterbuildName() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Введите наименование сооружения";
            } else if (Objects.equals(lang, "kz")) {
                return "Құрылыстың атауын енгізіңіз";
            } else {
                return "Enter building name";
            }
        }
        String buildNameHelp() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Будет отображаться в заголовке.";
            } else if (Objects.equals(lang, "kz")) {
                return "Бейнеленетін болады атауында.";
            } else {
                return "Will be displayed in title.";
            }
        }
        String buildDesc() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Текст - описание сооружения.";
            } else if (Objects.equals(lang, "kz")) {
                return "Мәтін-құрылыстың сипаттамасы.";
            } else {
                return "Text - description of the structure.";
            }
        }
        String buildDescPlace() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Введите описание сооружения.";
            } else if (Objects.equals(lang, "kz")) {
                return "Құрылыстың сипаттамасын енгізіңіз.";
            } else {
                return "Enter a description of the structure.";
            }
        }
        String buildDescHelp() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Это описание, которое будет на странице сооружения.";
            } else if (Objects.equals(lang, "kz")) {
                return "Бұл ғимарат бетінде болатын сипаттама.";
            } else {
                return "This is the description that will be on the construction page.";
            }
        }
        String buildImage() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Изображение сооружения.";
            } else if (Objects.equals(lang, "kz")) {
                return "Құрылыстың бейнесі.";
            } else {
                return "Building picture.";
            }
        }
        String buildImagePlace() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Выберите изображение.";
            } else if (Objects.equals(lang, "kz")) {
                return "Суретті таңдаңыз.";
            } else {
                return "Choose image.";
            }
        }
        String buildImageHelp() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Это изображение сооружения.";
            } else if (Objects.equals(lang, "kz")) {
                return "Бұл құрылыстың бейнесі.";
            } else {
                return "This is the building image.";
            }
        }
        String start() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Начало абзаца";
            } else if (Objects.equals(lang, "kz")) {
                return "Параграфтың басы";
            } else {
                return "New line";
            }
        }
        String end() {
            String lang = getLang();
            if (Objects.equals(lang, "ru")) {
                return "Конец абзаца";
            } else if (Objects.equals(lang, "kz")) {
                return "Абзацтың соңы";
            } else {
                return "End line";
            }
        }
    %>
  <h1 style="margin: 20px;
    background: #79baff;
    padding: 10px;
    border-radius: 10px;"><%= adminPanel() %></h1>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card t-25">
          <div class="card-header">
            <h2><%= userHandle() %></h2>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped" style="table-layout: fixed;overflow-wrap: break-word;">
                <thead>
                <th width="45%"><%= userName() %></th>
                <th width="15%"><%= messages() %></th>
                <th width="30%"><%= roles() %></th>
                <th width="10%"></th>
                </thead>
                <script>
                  setTimeout(function() {
                    $('#exampleModal').on('hidden.bs.modal', function () {
                      updateUsersNotify();
                    });
                  }, 1000);
                </script>
                <c:forEach items="${allUsers}" var="user">
                  <tr>
                    <td>${user.username}</td>
                    <td id="${user.id}">
                      <script>
                        (function() {
                          setTimeout(function() {
                            isAdminRead('${user.username}', '${user.id}')
                          }, 1000);
                        })();
                      </script>
                    </td>
                    <td>
                      <c:forEach items="${user.roles}" var="role">${role.name}; </c:forEach>
                    </td>
                    <td>
                      <form action="${pageContext.request.contextPath}/admin" method="post">
                        <input type="hidden" name="userId" value="${user.id}"/>
                        <input type="hidden" name="action" value="delete"/>
                        <button type="submit"><%= removeBtn() %></button>
                      </form>

                    </td>

                  </tr>
                </c:forEach>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12">

        <div class="card t-25">
          <div class="card-header">
            <h2><%= addBuild() %></h2>
          </div>
          <div class="card-body">
            <iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>
            <form method="POST" enctype="multipart/form-data" id="fileUploadForm" onsubmit="createdBuilding()"
                  action="${pageContext.request.contextPath}/building/withImg" target="dummyframe">
              <div class="form-group">
                <label for="name"><%= buildName() %> (на русском) </label>
                <input type="text" class="form-control" id="name" name="name"
                       aria-describedby="nameHelp" placeholder="<%= enterbuildName() %>">
                <small id="nameHelp" class="form-text text-muted"><%= buildNameHelp() %></small>
              </div>
              <div class="form-group">
                <label for="kzName"><%= buildName() %> (қазақ тілінде) </label>
                <input type="text" class="form-control" id="kzName" name="kzName"
                       aria-describedby="nameHelpKz" placeholder="<%= enterbuildName() %>">
                <small id="nameHelpKz" class="form-text text-muted"><%= buildNameHelp() %></small>
              </div>
              <div class="form-group">
                <label for="enName"><%= buildName() %> (english) </label>
                <input type="text" class="form-control" id="enName" name="enName"
                       aria-describedby="nameHelpEn" placeholder="<%= enterbuildName() %>">
                <small id="nameHelpEn" class="form-text text-muted"><%= buildNameHelp() %></small>
              </div>
              <div class="form-group">
                <label for="text"><%= buildDesc() %> (на русском) </label>
                <div>
                  <button type="button" onclick="addNewLine()" class="btn btn-secondary"><%= start() %></button>
                  <button type="button" onclick="addEndLine()" class="btn btn-secondary"><%= end() %></button>
                </div>
                <br>
                <textarea class="form-control" id="text" name="text" rows="3"
                          aria-describedby="textHelp" placeholder="<%= buildDescPlace() %>"></textarea>
                <small id="textHelp" class="form-text text-muted"><%= buildDescHelp() %></small>
              </div>
              <div class="form-group">
                <label for="text"><%= buildDesc() %> (қазақ тілінде) </label>
                <div>
                  <button type="button" onclick="addNewLineKz()" class="btn btn-secondary"><%= start() %></button>
                  <button type="button" onclick="addEndLineKz()" class="btn btn-secondary"><%= end() %></button>
                </div>
                <br>
                <textarea class="form-control" id="kzText" name="kzText" rows="3"
                          aria-describedby="textHelp" placeholder="<%= buildDescPlace() %>"></textarea>
                <small id="kzTextHelp" class="form-text text-muted"><%= buildDescHelp() %></small>
              </div>
              <div class="form-group">
                <label for="text"><%= buildDesc() %> (english) </label>
                <div>
                  <button type="button" onclick="addNewLineEn()" class="btn btn-secondary"><%= start() %></button>
                  <button type="button" onclick="addEndLineEn()" class="btn btn-secondary"><%= end() %></button>
                </div>
                <br>
                <textarea class="form-control" id="enText" name="enText" rows="3"
                          aria-describedby="textHelp" placeholder="<%= buildDescPlace() %>"></textarea>
                <small id="enTextHelp" class="form-text text-muted"><%= buildDescHelp() %></small>
              </div>
              <div class="form-group">
                <label for="img"><%= buildImage() %></label>
                <input type="file" class="form-control" id="img" name="image"
                       aria-describedby="imageHelp" placeholder="<%= buildImagePlace() %>">
                <small id="imageHelp" class="form-text text-muted"><%= buildImageHelp() %></small>
              </div>
              <input type="submit" value="<%= addBtn() %>" id="btnSubmit" class="btn btn-primary"/>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="updateUsersNotify()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-12 t-25">
                <div class="card" id="messages-container">

                </div>
                <textarea class="form-control" rows="5" id="commentArea"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/popper.min.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
</body>
</html>