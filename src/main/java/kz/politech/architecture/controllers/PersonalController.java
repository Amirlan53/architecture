package kz.politech.architecture.controllers;

import kz.politech.architecture.model.Personal;
import kz.politech.architecture.model.User;
import kz.politech.architecture.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/userPersonal")
public class PersonalController {

    @Autowired
    private MyUserDetailsService userService;



    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> get() {

        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();

            response.put("response", userService.loadUserByUsername(username));

        }
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    @ResponseBody
    public ResponseEntity<Map<String, Object>> create(@ModelAttribute Personal personal) {


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = (User) userService.loadUserByUsername(username);
            if (user.getPassword() != null && !Objects.equals(user.getPassword(), "")) {
                user.setFirstName(personal.getFirstName());
                user.setLastName(personal.getLastName());
                user.setPassword(personal.getPassword());
                user.setPasswordConfirm(personal.getPassword());
                userService.updateUser(user);
            }

        }
        Map<String, Object> response = new HashMap<>();
        response.put("response", "done");
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
