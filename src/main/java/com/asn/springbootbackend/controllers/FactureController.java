package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Facture;
import com.asn.springbootbackend.repositories.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class FactureController {

    @Autowired
    private FactureRepository factureRepository;

    // GET all factures
    @GetMapping("/factures")
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    // GET facture par ID
    @GetMapping("/factures/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable int id) {
        Optional<Facture> facture = factureRepository.findById(id);
        return facture.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new facture (AVEC RÈGLES MÉTIER)
    @PostMapping("/factures")
    public ResponseEntity<?> createFacture(@RequestBody Facture facture) {

        // 1. Vérifier date émission et échéance
        if (facture.getDateEmition() != null && facture.getDateEcheance() != null) {
            if (facture.getDateEcheance().isBefore(facture.getDateEmition())) {
                return ResponseEntity.badRequest()
                        .body("La date d'échéance ne peut pas être avant la date d'émission.");
            }
        }

        // 2. Statut par défaut
        if (facture.getStatut() == null || facture.getStatut().isEmpty()) {
            facture.setStatut("En attente");
        }

        // 3. Mettre à jour la dateUpdate si ton model la contient
        try {
            facture.getClass().getMethod("setDateUpdate", LocalDate.class)
                    .invoke(facture, LocalDate.now());
        } catch (Exception ignored) {}

        Facture saved = factureRepository.save(facture);
        return ResponseEntity.ok(saved);
    }

    // PUT update facture (AVEC RÈGLES MÉTIER)
    @PutMapping("/factures/{id}")
    public ResponseEntity<?> updateFacture(@PathVariable int id, @RequestBody Facture details) {

        return factureRepository.findById(id).map(facture -> {

            // 1. Vérifier dates
            if (details.getDateEmition() != null && details.getDateEcheance() != null) {
                if (details.getDateEcheance().isBefore(details.getDateEmition())) {
                    return ResponseEntity.badRequest()
                            .body("Date d'échéance invalide !");
                }
            }

            facture.setDateEmition(details.getDateEmition());
            facture.setNum(details.getNum());
            facture.setEtatPaie(details.getEtatPaie());
            facture.setDateEcheance(details.getDateEcheance());
            facture.setTauxTva(details.getTauxTva());
            facture.setMentionLegal(details.getMentionLegale());
            facture.setStatut(details.getStatut());
            facture.setContrat(details.getContrat());

            // Auto update dateUpdate si existe
            try {
                facture.getClass().getMethod("setDateUpdate", LocalDate.class)
                        .invoke(facture, LocalDate.now());
            } catch (Exception ignored) {}

            Facture updatedFacture = factureRepository.save(facture);
            return ResponseEntity.ok(updatedFacture);

        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/factures/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable int id) {
        return factureRepository.findById(id).map(facture -> {
            factureRepository.delete(facture);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
