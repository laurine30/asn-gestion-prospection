package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.AppelOffre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppelOffreRepository extends JpaRepository<AppelOffre,Integer>{
}
