package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.MessageRepository;
import kz.politech.architecture.model.Messages;
import kz.politech.architecture.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> get(@RequestParam("name") String name) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        Collection<Role> roles = (Collection<Role>) ((UserDetails) principal).getAuthorities();
        Set<String> roles_str = new HashSet<>();
        for (Role role : roles) {
            roles_str.add(role.getName());
        }
        if (!Objects.equals(username, name) && !roles_str.contains("ROLE_ADMIN")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("response", messageRepository.getAllByAuthor(name));
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/isAdminRead", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> adminRead(@RequestParam("name") String name) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        Collection<Role> roles = (Collection<Role>) ((UserDetails) principal).getAuthorities();
        Set<String> roles_str = new HashSet<>();
        for (Role role : roles) {
            roles_str.add(role.getName());
        }
        if (!Objects.equals(username, name) && !roles_str.contains("ROLE_ADMIN")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Map<String, Object> response = new HashMap<>();
        List<Messages> list = messageRepository.getAllByAuthor(name);
        boolean allRead = true;
        for (Messages messages : list) {
            if (!messages.isAdminRead()) {
                allRead = false;
            }
        }
        response.put("response", allRead);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> message) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        Collection<Role> roles = (Collection<Role>) ((UserDetails) principal).getAuthorities();
        Set<String> roles_str = new HashSet<>();
        boolean isAdmin = false;
        for (Role role : roles) {
            roles_str.add(role.getName());
        }
        if (roles_str.contains("ROLE_ADMIN")) {
            message.put("admin", username);
            isAdmin = true;
        } else {
            message.put("author", username);
        }
        message.put("date", new Date());
        ObjectMapper objectMapper = new ObjectMapper();
        Messages messagesModel =  objectMapper.convertValue(message, Messages.class);
        messageRepository.save(messagesModel);
        Map<String, Object> response = new HashMap<>();
        response.put("response", "done");
        List<Messages> allMesFromUser = messageRepository.getAllByAuthor(message.get("author").toString());
        for (Messages messages : allMesFromUser) {
            if (isAdmin) {
                messages.setAdminRead(true);
            } else {
                messages.setAuthorRead(true);
            }
            messageRepository.save(messages);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/reply", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> reply(@RequestBody Map<String, Object> message) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        message.put("admin", username);
        message.put("date", new Date());
        ObjectMapper objectMapper = new ObjectMapper();
        Messages messagesModel =  objectMapper.convertValue(message, Messages.class);
        messageRepository.save(messagesModel);
        Map<String, Object> response = new HashMap<>();
        response.put("response", "done");
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
