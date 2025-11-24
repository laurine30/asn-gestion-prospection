package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Role;
import com.asn.springbootbackend.repositories.RoleRepository;
import com.asn.springbootbackend.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // GET : Tous les rôles
    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // GET : Rôle par ID
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable int id) {
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST : Création d’un rôle avec logique métier
    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Role role) {

        // 1. Normaliser le nom du rôle
        role.setLibRole(role.getLibRole().toUpperCase());

        // 2. Vérifier l'unicité du rôle
        if (roleRepository.existsByLibRole(role.getLibRole())) {
            return ResponseEntity.badRequest().body("Ce rôle existe déjà !");
        }

        // 3. Mettre la date automatiquement
        role.setDateUpdate(LocalDate.now());

        Role newRole = roleRepository.save(role);
        return ResponseEntity.ok(newRole);
    }

    // PUT : Mise à jour d’un rôle existant
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable int id, @RequestBody Role details) {
        return roleRepository.findById(id).map(role -> {

            // Normaliser le libellé
            String newLibelle = details.getLibRole().toUpperCase();

            // Vérifier unicité si changement
            if (!newLibelle.equals(role.getLibRole()) &&
                    roleRepository.existsByLibRole(newLibelle)) {

                return ResponseEntity.badRequest().body("Un rôle avec ce nom existe déjà !");
            }

            role.setLibRole(newLibelle);
            role.setDateUpdate(LocalDate.now());
            role.setUserUpdate(details.getUserUpdate());

            Role updatedRole = roleRepository.save(role);
            return ResponseEntity.ok(updatedRole);

        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE : Suppression d’un rôle
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable int id) {
        return roleRepository.findById(id).map(role -> {

            // Vérifier si des utilisateurs utilisent ce rôle
            long countUsers = utilisateurRepository.countByRole(role);
            if (countUsers > 0) {
                return ResponseEntity.badRequest()
                        .body("Impossible de supprimer : des utilisateurs utilisent ce rôle !");
            }

            roleRepository.delete(role);
            return ResponseEntity.noContent().build();

        }).orElse(ResponseEntity.notFound().build());
    }
}
