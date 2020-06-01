package kz.politech.architecture.dao;

import kz.politech.architecture.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> getAllByUrl(String url);

}
