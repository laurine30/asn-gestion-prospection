package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.Role;
import com.asn.springbootbackend.models.Type;
import com.asn.springbootbackend.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);
    long countByRole(Role role);

    // Optionnel : trouver tous les utilisateurs par rôle
    // List<Utilisateur> findByRole(Role role);

    // Optionnel : vérifier si un email existe déjà
    // boolean existsByEmail(String email);
}


