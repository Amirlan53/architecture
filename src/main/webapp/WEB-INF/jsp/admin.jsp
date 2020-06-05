<%@ page import="kz.politech.architecture.model.User" %>
<%@ page import="java.util.List" %>
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

<body>
<div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card t-25">
          <div class="card-header">
            <h2>Панель администратора</h2>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped" style="table-layout: fixed;overflow-wrap: break-word;">
                <thead>
                <th width="45%">Имя пользователя</th>
                <th width="15%">Сообщения</th>
                <th width="30%">Роли</th>
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
                        <button type="submit">Удалить</button>
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