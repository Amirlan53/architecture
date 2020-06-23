package kz.politech.architecture.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.politech.architecture.dao.BuildingRepository;
import kz.politech.architecture.dao.RecordRepository;
import kz.politech.architecture.model.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @Autowired
    private BuildingRepository buildingRepository;

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
        Page<Record> records = recordRepository.findAll(PageRequest.of(0, 5, Sort.by("likes").descending()));
        List<Map<String, Object>> list = new ArrayList<>();
        for (Record record : records) {
            Map<String, Object> obj = new HashMap<>();
            obj.put("url", record.getUrl());
            obj.put("id", record.getId());
            obj.put("likes", record.getLikes());
            obj.put("whoLiked", record.getWhoLiked());
            String buildingId = record.getUrl().substring(record.getUrl().lastIndexOf("/") + 1);

            if (buildingId != null && buildingRepository.getOne(Long.valueOf(buildingId)) != null &&
                    buildingRepository.existsById(Long.valueOf(buildingId))) {
                obj.put("buildingName", buildingRepository.getOne(Long.valueOf(buildingId)).getName());
                list.add(obj);
            }
        }
        response.put("response", list);
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
