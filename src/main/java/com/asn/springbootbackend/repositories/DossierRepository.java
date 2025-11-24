package com.asn.springbootbackend.repositories;


import com.asn.springbootbackend.models.Dossier;
import com.asn.springbootbackend.models.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DossierRepository extends JpaRepository<Dossier, Integer> {
}