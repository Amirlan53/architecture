package kz.politech.architecture.dao;

import kz.politech.architecture.model.Messages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Messages, Long> {
    List<Messages> getAllByAuthor(String author);
}
