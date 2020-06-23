package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.BuildingRepository;
import kz.politech.architecture.model.Building;
import kz.politech.architecture.model.FormWrapper;
import kz.politech.architecture.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.ByteBuffer;
import java.util.*;

@RestController
@RequestMapping("/building")
public class BuildingController {

    @Autowired
    private BuildingRepository buildingRepository;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String get(@PathVariable("id") String id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Collection<Role> roles = new ArrayList<>();
        if (principal instanceof UserDetails) {
            roles = (Collection<Role>) ((UserDetails) principal).getAuthorities();
        }
        Set<String> roles_str = new HashSet<>();
        for (Role role : roles) {
            roles_str.add(role.getName());
        }

        String html = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"utf-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n" +
                "    <link href=\"../../css/custom.css\" rel=\"stylesheet\">\n" +
                "    <link rel=\"stylesheet\" href=\"../../css/bootstrap.min.css\">\n";

        Building building = buildingRepository.getOne(Long.valueOf(id));
        if (building != null) {
            html += "<title>" + building.getName() + "</title>";
            html += "</head>\n" +
                    "<body>\n" +
                    "\n" +
                    "<div class=\"container-fluid\">\n" +
                    "    <div class=\"row\">\n" +
                    "        <div class=\"col-2\"></div>\n" +
                    "        <div class=\"col-8 t-25\">\n" +
                    "            <div class=\"card\">\n" +
                    "                <div class=\"card-header\">\n" +
                    "                    <h3>";
            html += getTitle(building);
            html += "                        <span class=\"float-right\">\n" +
                    "                            <span id=\"likeNum\"></span>\n" +
                    "                            <svg class=\"bi bi-heart-fill\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\"\n" +
                    "                                 fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" onclick=\"like()\">\n" +
                    "                                <path fill-rule=\"evenodd\" d=\"M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z\"></path>\n" +
                    "                            </svg>\n" +
                    "                           <span onclick=\"deleteBuilding(" + id + ")\" style=\"cursor:pointer; color: black\">" +
                    "<svg class=\"bi bi-trash-fill\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                    "  <path fill-rule=\"evenodd\" d=\"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z\"/>\n" +
                    "</svg>" +
                    "</span>" +
                    "                        </span>\n" +
                    "                    </h3>\n" +
                    "                </div>\n" +
                    "                <div class=\"card-body\">";
            html += "<div style='text-align:center'>" +
                    "<img src=\"/building/" + id + "/img" + "\" id=\"photo\" alt=\"" + getTitle(building) + "\" />" +
                    "</div><br>";
            String text = getText(building);
            text = text.replaceAll(" @newLine@ ", "<p>");
            text = text.replaceAll(" @endLine@ ", "</p>");
            html += text;
            html += "<hr>\n" +
                    "\n" +
                    "                    <div id=\"comment-container\"></div>" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "        <div class=\"col-2\"></div>\n" +
                    "    </div>\n";

            if (roles_str.contains("ROLE_ADMIN")) {
                html += "  <div class=\"row\">" +
                        "       <div class=\"col-2\"></div>" +
                        "       <div class=\"col-8\">" +
                        "   <div class=\"card\">   <div class=\"card-body\">     <h4>" + changeParagraph() + "</h4>" +
                        "<iframe name=\"dummyframe\" id=\"dummyframe\" style=\"display: none;\"></iframe>" +
                        "           <form method=\"POST\" enctype=\"multipart/form-data\" id=\"fileUploadForm\" onsubmit=\"createdBuilding()\"\n" +
                        "                  action=\"/building/withImg?id=" + id + "\" target=\"dummyframe\">\n" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"name\">" + buildName() + " (на русском) </label>\n" +
                        "                <input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\"\n" +
                        "                       aria-describedby=\"nameHelp\" placeholder=\"" + enterbuildName() + "\">\n" +
                        "                <small id=\"nameHelp\" class=\"form-text text-muted\">" + buildNameHelp() + "</small>\n" +
                        "              </div>\n" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"name\">" + buildName() + " (қазақ тілінде) </label>\n" +
                        "                <input type=\"text\" class=\"form-control\" id=\"kzName\" name=\"kzName\"\n" +
                        "                       aria-describedby=\"nameHelpKz\" placeholder=\"" + enterbuildName() + "\">\n" +
                        "                <small id=\"nameHelpKz\" class=\"form-text text-muted\">" + buildNameHelp() + "</small>\n" +
                        "              </div>\n" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"name\">" + buildName() + " (english) </label>\n" +
                        "                <input type=\"text\" class=\"form-control\" id=\"enName\" name=\"enName\"\n" +
                        "                       aria-describedby=\"nameHelpEn\" placeholder=\"" + enterbuildName() + "\">\n" +
                        "                <small id=\"nameHelpEn\" class=\"form-text text-muted\">" + buildNameHelp() + "</small>\n" +
                        "              </div>\n" +
                        "<div class=\"form-group\">\n" +
                        "                <label for=\"text\">" + buildDesc() + " (на русском) </label>\n" +
                        "                <div>\n" +
                        "                  <button type=\"button\" onclick=\"addNewLine()\" class=\"btn btn-secondary\">" + start() + "</button>\n" +
                        "                  <button type=\"button\" onclick=\"addEndLine()\" class=\"btn btn-secondary\">"  + end() + "</button>\n" +
                        "                </div>\n" +
                        "                <br>\n" +
                        "                <textarea class=\"form-control\" id=\"text\" name=\"text\" rows=\"3\"\n" +
                        "                          aria-describedby=\"textHelp\" placeholder=\""  + buildDescPlace() + "\"></textarea>\n" +
                        "                <small id=\"textHelp\" class=\"form-text text-muted\">"  + buildDescHelp() + "</small>\n" +
                        "              </div>\n" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"text\">" + buildDesc() +  " (қазақ тілінде) </label>\n" +
                        "                <div>\n" +
                        "                  <button type=\"button\" onclick=\"addNewLineKz()\" class=\"btn btn-secondary\">" + start() + "</button>\n" +
                        "                  <button type=\"button\" onclick=\"addEndLineKz()\" class=\"btn btn-secondary\">" + end() + "</button>\n" +
                        "                </div>\n" +
                        "                <br>\n" +
                        "                <textarea class=\"form-control\" id=\"kzText\" name=\"kzText\" rows=\"3\"\n" +
                        "                          aria-describedby=\"textHelp\" placeholder=\"" + buildDescPlace() + "\"></textarea>\n" +
                        "                <small id=\"kzTextHelp\" class=\"form-text text-muted\">" + buildDescHelp() + "</small>\n" +
                        "              </div>\n" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"text\">" + buildDesc() +  " (english) </label>\n" +
                        "                <div>\n" +
                        "                  <button type=\"button\" onclick=\"addNewLineEn()\" class=\"btn btn-secondary\">" + start() + "</button>\n" +
                        "                  <button type=\"button\" onclick=\"addEndLineEn()\" class=\"btn btn-secondary\">" + end() + "</button>\n" +
                        "                </div>\n" +
                        "                <br>\n" +
                        "                <textarea class=\"form-control\" id=\"enText\" name=\"enText\" rows=\"3\"\n" +
                        "                          aria-describedby=\"textHelp\" placeholder=\"" + buildDescPlace() + "\"></textarea>\n" +
                        "                <small id=\"enTextHelp\" class=\"form-text text-muted\">" + buildDescHelp() + "</small>\n" +
                        "              </div>" +
                        "              <div class=\"form-group\">\n" +
                        "                <label for=\"img\">" + buildImage() + "</label>\n" +
                        "                <input type=\"file\" class=\"form-control\" id=\"img\" name=\"image\"\n" +
                        "                       aria-describedby=\"imageHelp\" placeholder=\"" + buildImagePlace() + "\">\n" +
                        "                <small id=\"imageHelp\" class=\"form-text text-muted\">" + buildImageHelp() + "</small>\n" +
                        "              </div>\n" +
                        "              <input type=\"submit\" value=\"" + add() + "\" id=\"btnSubmit\" class=\"btn btn-primary\"/>\n" +
                        "            </form>" +
                        "       </div></div></div>" +
                        "       <div class=\"col-2\"></div>" +
                        "   </div>";
            }
            html+= "</div>";
        } else {
            html += "<title>Нет такого здания</title>" +
                    "</head>" +
                    "<body>Отсутствуют данные";
        }

        html += "\n" +
                "\n" +
                "<script src=\"../../js/common.js\"></script>\n" +
                "<script src=\"../../js/jquery-3.3.1.slim.min.js\"></script>\n" +
                "<script src=\"../../js/popper.min.js\"></script>\n" +
                "<script src=\"../../js/bootstrap.min.js\"></script>\n" +
                "</body>\n" +
                "</html>";

        return html;

    }

    String getTitle(Building building) {
        String lang = getLang();
        if (Objects.equals(lang, "ru")) {
            return building.getName();
        } else if (Objects.equals(lang, "kz")) {
            return building.getKzName();
        } else {
            return building.getEnName();
        }
    }

    String getText(Building building) {
        String lang = getLang();
        if (Objects.equals(lang, "ru")) {
            return building.getText();
        } else if (Objects.equals(lang, "kz")) {
            return building.getKzText();
        } else if (building.getEnText() != null) {
            return building.getEnText();
        } else {
            return building.getText();
        }
    }

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

    String changeParagraph() {
        String lang = getLang();
        if (Objects.equals(lang, "ru")) {
            return "Изменение записи";
        } else if (Objects.equals(lang, "kz")) {
            return "Жазбаны өзгерту";
        } else {
            return "Edit Record";
        }
    }

    String add() {
        String lang = getLang();
        if (Objects.equals(lang, "ru")) {
            return "Добавить";
        } else if (Objects.equals(lang, "kz")) {
            return "Қосу";
        } else {
            return "Add";
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

    @RequestMapping(value = "/withImg", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> withImgCreate(@RequestParam(value = "id", required = false) String id, @ModelAttribute FormWrapper model)
            throws IOException {

        if (id != null && !Objects.equals("", id)) {
            Building building = buildingRepository.getOne(Long.valueOf(id));
            building.setText(model.getText());
            building.setName(model.getName());
            building.setImage(model.getImage().getBytes());
            building.setEnName(model.getEnName());
            building.setKzName(model.getKzName());
            building.setEnText(model.getEnText());
            building.setKzText(model.getKzText());
            buildingRepository.save(building);
        } else {
            Building building = new Building();
            building.setText(model.getText());
            building.setName(model.getName());
            building.setImage(model.getImage().getBytes());
            building.setEnName(model.getEnName());
            building.setKzName(model.getKzName());
            building.setEnText(model.getEnText());
            building.setKzText(model.getKzText());
            buildingRepository.save(building);
        }
        return new ResponseEntity<>(new HashMap<String, Object>(){{put("response", "");}}, HttpStatus.OK);

    }

    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> delete(@RequestParam("id") String id, @ModelAttribute FormWrapper model)
            throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Collection<Role> roles = new ArrayList<>();
        if (principal instanceof UserDetails) {
            roles = (Collection<Role>) ((UserDetails) principal).getAuthorities();
        }
        Set<String> roles_str = new HashSet<>();
        for (Role role : roles) {
            roles_str.add(role.getName());
        }

        if (id != null && !Objects.equals("", id)) {
            Building building = buildingRepository.getOne(Long.valueOf(id));
            if (roles_str.contains("ROLE_ADMIN")) {
                buildingRepository.delete(building);
            }
        }
        return new ResponseEntity<>(new HashMap<String, Object>(){{put("response", "");}}, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}/img", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] getImage(@PathVariable("id") String id) throws IOException, ClassNotFoundException {

        Building building = buildingRepository.getOne(Long.valueOf(id));
        if (building != null) {
            return building.getImage();
        }
        return null;

    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getAll() {

        Map<String, Object> map = new HashMap<String, Object>(){{
            put("response", buildingRepository.findAll());
        }};
        return new ResponseEntity<>(map, HttpStatus.OK);

    }

}
