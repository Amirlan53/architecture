<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="${pageContext.request.contextPath}/css/custom.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/bootstrap.min.css">
    <title>Сброс пароля</title>
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
                    <h2>Сброс пароля</h2>
                </div>
                <div class="card-body">
                    <form:form method="POST" modelAttribute="userForm">
                        <div class="form-group">
                            <label for="username">Имя пользователя:</label>
                            <form:input type="email" path="username" placeholder="Имя пользователя"
                                        autofocus="true" class="form-control" id="username"></form:input>
                            <form:errors path="username"></form:errors>
                                ${usernameError}
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль:</label>
                            <form:input type="password" path="password" placeholder="Пароль"
                                        class="form-control" id="password"></form:input>
                        </div>
                        <div class="form-group">
                            <label for="passwordConfirm">Повторить пароль:</label>
                            <form:input type="password" path="passwordConfirm" id="passwordConfirm"
                                        placeholder="Повторить пароль" class="form-control"></form:input>
                            <form:errors path="password"></form:errors>
                                ${passwordError}
                        </div>
                        <button type="submit" class="btn btn-primary">Сбросить</button>
                    </form:form>
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
