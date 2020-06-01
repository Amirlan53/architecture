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
  <title>Регистрация</title>
</head>

<body>
<div>
  <div class="container">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6">
        <div class="card t-25">
          <div class="card-header">
            <h2>Регистрация</h2>
          </div>
          <div class="card-body">
            <form:form method="POST" modelAttribute="userForm">
              <div class="form-group">
                <label for="username">Имя пользователя:</label>
                <form:input type="text" path="username" placeholder="Имя пользователя"
                            autofocus="true" class="form-control" id="username"></form:input>
                <form:errors path="username"></form:errors>
                  ${usernameError}
              </div>
              <div class="form-group">
                <label for="password">Пароль:</label>
                <form:input type="password" path="password" placeholder="Пароль" class="form-control" id="password"></form:input>
              </div>
              <div class="form-group">
                <label for="passwordConfirm">Повторить пароль:</label>
                <form:input type="password" path="passwordConfirm" id="passwordConfirm"
                            placeholder="Повторить пароль" class="form-control"></form:input>
                <form:errors path="password"></form:errors>
                  ${passwordError}
              </div>
              <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
            </form:form>
          </div>
        </div>
      </div>
      <div class="col-3"></div>
    </div>
  </div>

</div>
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery-3.3.1.slim.min.js"></script>
<script src="${pageContext.request.contextPath}/js/popper.min.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
</body>
</html>