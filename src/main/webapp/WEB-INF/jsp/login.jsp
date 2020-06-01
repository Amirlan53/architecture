<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link href="${pageContext.request.contextPath}/css/custom.css" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/bootstrap.min.css">
  <title>Авторизация</title>
</head>

<body>
<%
  String referrer = request.getHeader("Referer");
  if(referrer!=null){
    request.getSession().setAttribute("url_prior_login", referrer);
  }
%>
<sec:authorize access="isAuthenticated()">
  <% response.sendRedirect("/"); %>
</sec:authorize>

<div class="container">
  <div class="row">
    <div class="col-3"></div>
    <div class="col-6">
      <div class="card t-25">
        <div class="card-header">
          <h2>Авторизация</h2>
        </div>
        <div class="card-body">
          <form method="POST" action="${pageContext.request.contextPath}/login">
            <div class="form-group">
              <label for="username">Имя пользователя:</label>
              <input name="username" type="text" placeholder="Имя пользователя"
                     autofocus="true" class="form-control" id="username">
            </div>
            <div class="form-group">
              <label for="pwd">Пароль:</label>
              <input type="password" class="form-control" placeholder="Пароль" name="password" id="pwd">
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
            <span onclick="goToPage('${pageContext.request.contextPath}/registration')" class="btn btn-primary float-right">Зарегистрироваться</span>
          </form>
        </div>
      </div>
    </div>
    <div class="col-3"></div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery-3.3.1.slim.min.js"></script>
<script src="${pageContext.request.contextPath}/js/popper.min.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>

</body>
</html>
