package kz.politech.architecture.dao;

import kz.politech.architecture.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> getAllByUrl(String url);

}
