package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.RecordRepository;
import kz.politech.architecture.model.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/record")
public class RecordController {

    @Autowired
    private RecordRepository recordRepository;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> get(@RequestParam("url") String url) {

        Map<String, Object> response = new HashMap<>();
        response.put("response", recordRepository.getAllByUrl(url));
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getAll() {

        Map<String, Object> response = new HashMap<>();
        response.put("response", recordRepository.findAll(PageRequest.of(0, 5, Sort.by("likes").descending())));
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> comment) {

        ObjectMapper objectMapper = new ObjectMapper();
        Record commentModel =  objectMapper.convertValue(comment, Record.class);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        String name = ((UserDetails) principal).getUsername();
        if (name != null) {
            List<String> whoLiked = new LinkedList<>();
            if (comment.get("whoLiked") != null) {
                whoLiked = (List<String>) comment.get("whoLiked");
            }
            if (!whoLiked.contains(name)) {
                whoLiked.add(name);
                commentModel.setWhoLiked(whoLiked);
                recordRepository.save(commentModel);
            } else {
                whoLiked.remove(name);
                commentModel.setWhoLiked(whoLiked);
                recordRepository.save(commentModel);
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("response", "done");
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
