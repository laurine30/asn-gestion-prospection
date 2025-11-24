package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Prospection;
import com.asn.springbootbackend.repositories.ProspectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/prospection")
public class ProspectionController {

    @Autowired
    private ProspectionRepository prospectionRepository;

    // GET all prospections
    @GetMapping
    public List<Prospection> getAllProspections() {
        return prospectionRepository.findAll();
    }

    // GET prospection by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProspectionById(@PathVariable int id) {
        return prospectionRepository.findById(id)
                .map(prospection -> ResponseEntity.ok((Object) prospection))
                .orElse(ResponseEntity.badRequest().body("Prospection introuvable !"));
    }


    // POST create new prospection
    @PostMapping
    public ResponseEntity<?> createProspection(@RequestBody Prospection prospection) {

        // 1. Statut par défaut
        if (prospection.getStatut() == null || prospection.getStatut().isEmpty()) {
            prospection.setStatut("En cours");
        }

        // 2. Date de publication automatique
        prospection.setDatePublication(LocalDate.now());

        // 3. Vérifier qu’un client est associé (si obligatoire dans ton modèle)
        if (prospection.getClient() == null) {
            return ResponseEntity.badRequest().body("Un client doit être associé à la prospection !");
        }

        Prospection saved = prospectionRepository.save(prospection);
        return ResponseEntity.ok(saved);
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProspection(@PathVariable int id, @RequestBody Prospection details) {
        return prospectionRepository.findById(id).map(prospection -> {

            // 1. Mise à jour du statut
            if (details.getStatut() != null) {
                prospection.setStatut(details.getStatut());
            }

            // 2. Mise à jour de la datePublication uniquement si fournie
            if (details.getDatePublication() != null) {
                prospection.setDatePublication(details.getDatePublication());
            }

            // 3. Mise à jour du client
            if (details.getClient() != null) {
                prospection.setClient(details.getClient());
            }

            // 4. Date de mise à jour automatique
            prospection.setDateUpdate(LocalDate.now());

            Prospection updated = prospectionRepository.save(prospection);
            return ResponseEntity.ok(updated);

        }).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE prospection
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProspection(@PathVariable int id) {
        return prospectionRepository.findById(id).map(prospection -> {

            // Règle métier : interdiction de supprimer une prospection gagnée
            if ("Gagnée".equalsIgnoreCase(prospection.getStatut())) {
                return ResponseEntity.badRequest()
                        .body("Impossible de supprimer une prospection déjà gagnée !");
            }

            prospectionRepository.delete(prospection);
            return ResponseEntity.noContent().build();

        }).orElse(ResponseEntity.badRequest().body("Prospection introuvable !"));
    }

}
