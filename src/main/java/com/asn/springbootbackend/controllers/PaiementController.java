package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Paiement;
import com.asn.springbootbackend.models.Facture;
import com.asn.springbootbackend.repositories.PaiementRepository;
import com.asn.springbootbackend.repositories.FactureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/paiements")
public class PaiementController {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private FactureRepository factureRepository;

    // GET all paiements
    @GetMapping
    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaiementById(@PathVariable int id) {

        return paiementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create paiement
    @PostMapping("/facture/{idFacture}")
    public ResponseEntity<?> createPaiement(
            @PathVariable int idFacture,
            @RequestBody Paiement p) {

        Facture facture = factureRepository.findById(idFacture).orElse(null);

        if (facture == null) {
            return ResponseEntity.badRequest().body("Facture introuvable !");
        }

        // règle métier : ne pas dépasser montant dû
        if (p.getMontant() <= 0) {
            return ResponseEntity.badRequest().body("Montant invalide !");
        }

        p.setFacture(facture);
        p.setDatePaiement(LocalDate.now());

        paiementRepository.save(p);

        return ResponseEntity.ok("Paiement enregistré !");
    }

    // DELETE paiement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaiement(@PathVariable int id) {
        return paiementRepository.findById(id).map(p -> {
            paiementRepository.delete(p);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.badRequest().body("Paiement introuvable !"));
    }
}
