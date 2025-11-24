package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement,Integer> {
}
