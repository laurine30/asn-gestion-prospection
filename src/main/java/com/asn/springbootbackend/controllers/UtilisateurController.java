package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Utilisateur;
import com.asn.springbootbackend.models.Role;
import com.asn.springbootbackend.repositories.UtilisateurRepository;
import com.asn.springbootbackend.repositories.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    // GET : Tous les utilisateurs
    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // GET : Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable int id) {
        return utilisateurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST : Création d’un utilisateur avec logique métier
    @PostMapping
    public ResponseEntity<?> createUtilisateur(@RequestBody Utilisateur utilisateur) {

        // 1. Vérifier si email existe déjà
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé !");
        }

        // 2. Définir la date de création
        utilisateur.setDateUpdate(LocalDate.now());

        // 3. Chiffrer le mot de passe (simple simulation)
        utilisateur.setMotDePasse("HASH(" + utilisateur.getMotDePasse() + ")");

        // 4. Affecter un rôle par défaut si vide
        if (utilisateur.getRole() == null) {
            Role role = roleRepository.findById(2) // Exemple rôle = "Utilisateur"
                    .orElse(null);
            utilisateur.setRole(role);
        }

        // 5. Enregistrer
        Utilisateur created = utilisateurRepository.save(utilisateur);

        return ResponseEntity.ok(created);
    }

    // PUT : Mise à jour utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable int id, @RequestBody Utilisateur details) {
        return utilisateurRepository.findById(id).map(utilisateur -> {

            // Mettre à jour les infos
            utilisateur.setNom(details.getNom());
            utilisateur.setPrenom(details.getPrenom());
            utilisateur.setEmail(details.getEmail());

            // Rehash du mot de passe si changé
            if (!details.getMotDePasse().equals(utilisateur.getMotDePasse())) {
                utilisateur.setMotDePasse("HASH(" + details.getMotDePasse() + ")");
            }

            utilisateur.setUserUpdate(details.getUserUpdate());
            utilisateur.setDateUpdate(LocalDate.now());
            utilisateur.setClient(details.getClient());
            utilisateur.setRole(details.getRole());

            Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
            return ResponseEntity.ok(updatedUtilisateur);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE : Suppression utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable int id) {
        return utilisateurRepository.findById(id).map(utilisateur -> {
            utilisateurRepository.delete(utilisateur);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH : Désactiver / Activer un utilisateur
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleActivation(@PathVariable int id) {
        return utilisateurRepository.findById(id).map(u -> {

            u.setActif(!u.isActif()); // inversion du statut
            u.setDateUpdate(LocalDate.now());

            utilisateurRepository.save(u);

            return ResponseEntity.ok(
                    "Utilisateur " + (u.isActif() ? "activé" : "désactivé"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH : Changer mot de passe
    @PatchMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable int id,
            @RequestBody String nouveauMdp) {

        return utilisateurRepository.findById(id).map(u -> {

            u.setMotDePasse("HASH(" + nouveauMdp + ")");
            u.setDateUpdate(LocalDate.now());

            utilisateurRepository.save(u);

            return ResponseEntity.ok("Mot de passe mis à jour !");
        }).orElse(ResponseEntity.notFound().build());
    }
}
