package kz.politech.architecture.dao;

import kz.politech.architecture.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
}
