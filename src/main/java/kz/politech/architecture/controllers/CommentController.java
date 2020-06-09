package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.CommentRepository;
import kz.politech.architecture.dao.UserRepository;
import kz.politech.architecture.model.Comment;
import kz.politech.architecture.model.User;
import kz.politech.architecture.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by Marcus on 05.05.2020.
 */
@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    public JavaMailSender emailSender;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> get(@RequestParam("url") String url) {

        System.out.println(url);
        Map<String, Object> response = new HashMap<>();
        List<Comment> comments = commentRepository.getAllByUrl(url);
        List<Map<String, Object>> res = new LinkedList<>();
        for (Comment comment : comments) {
            Map<String, Object> result = new HashMap<>();
            String author = comment.getAuthor();
            User user = userRepository.findByUsername(author);
            result.put("firstName", user.getFirstName());
            result.put("lastName", user.getLastName());
            result.put("text", comment.getText());
            result.put("url", comment.getUrl());
            result.put("date", comment.getDate());
            res.add(result);
        }
        response.put("response", commentRepository.getAllByUrl(url));
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/latest", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> latest() {

        Map<String, Object> response = new HashMap<>();
        List<Comment> list = commentRepository.findAll();
        List<Comment> comments = list.size() > 5 ? list.subList(list.size() - 5, list.size()) : list;
        List<Map<String, Object>> res = new LinkedList<>();
        for (Comment comment : comments) {
            Map<String, Object> result = new HashMap<>();
            String author = comment.getAuthor();
            User user = userRepository.findByUsername(author);
            result.put("firstName", user.getFirstName());
            result.put("lastName", user.getLastName());
            result.put("text", comment.getText());
            result.put("url", comment.getUrl());
            result.put("date", comment.getDate());
            res.add(result);
        }
        response.put("response", res);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> comment) {

        comment.put("date", new Date());
        ObjectMapper objectMapper = new ObjectMapper();
        Comment commentModel =  objectMapper.convertValue(comment, Comment.class);
        commentRepository.save(commentModel);
        Map<String, Object> response = new HashMap<>();
        response.put("response", "done");
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
