package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.CommentRepository;
import kz.politech.architecture.dao.RecordRepository;
import kz.politech.architecture.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Marcus on 05.05.2020.
 */
@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> get(@RequestParam("url") String url) {

        Map<String, Object> response = new HashMap<>();
        response.put("response", commentRepository.getAllByUrl(url));
        return new ResponseEntity<>(response, HttpStatus.OK);

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
