package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Integer>{
}
