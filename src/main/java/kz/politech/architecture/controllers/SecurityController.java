package kz.politech.architecture.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/security")
public class SecurityController {

    public static List<Map<String, String>> languages = new ArrayList<>();

    @RequestMapping(value = "/setLang", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> setLang(@RequestParam("lang") String lang) {

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            Map<String, String> lg = new HashMap<>();
            lg.put(((UserDetails) principal).getUsername(), lang);
            boolean set = false;
            for (Map<String, String> lg1: languages) {
                if (lg1.get(((UserDetails) principal).getUsername()) != null) {
                    lg1.put(((UserDetails) principal).getUsername(), lang);
                    set = true;
                }
            }
            if (!set) {
                languages.add(lg);
            }
        }
        response.put("response", result);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/isLogged", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> isLogged() {

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            result.put("username", ((UserDetails) principal).getUsername());
            result.put("roles", ((UserDetails) principal).getAuthorities());
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
