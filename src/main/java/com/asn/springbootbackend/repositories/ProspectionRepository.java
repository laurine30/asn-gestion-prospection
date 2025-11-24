package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.Prospection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProspectionRepository extends JpaRepository<Prospection, Integer>{
}
