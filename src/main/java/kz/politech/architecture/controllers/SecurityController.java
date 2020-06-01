package kz.politech.architecture.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/security")
public class SecurityController {

    @RequestMapping(value = "/isLogged", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> isLogged() {

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            result.put("username", ((UserDetails) principal).getUsername());
        } else {
            result.put("username", "");
        }

        if (authentication instanceof AnonymousAuthenticationToken) {
            result.put("val", false);
        } else {
            result.put("val", true);
        }
        response.put("response", result);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/username", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUsername() {

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            result.put("username", ((UserDetails) principal).getUsername());
        } else {
            result.put("username", "");
        }
        response.put("response", result);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
