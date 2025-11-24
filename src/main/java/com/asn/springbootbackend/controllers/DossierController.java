package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Dossier;
import com.asn.springbootbackend.repositories.DossierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class DossierController {

    @Autowired
    private DossierRepository dossierRepository;

    // GET all dossiers
    @GetMapping("/dossiers")
    public List<Dossier> getAllDossiers() {
        return dossierRepository.findAll();
    }

    // GET dossier by ID
    @GetMapping("/dossiers/{id}")
    public ResponseEntity<Dossier> getDossierById(@PathVariable int id) {
        Optional<Dossier> dossier = dossierRepository.findById(id);
        return dossier.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new dossier
    @PostMapping("/dossiers")
    public Dossier createDossier(@RequestBody Dossier dossier) {
        return dossierRepository.save(dossier);
    }

    //  PUT update existing dossier
    @PutMapping("/dossiers/{id}")
    public ResponseEntity<Dossier> updateDossier(@PathVariable int id, @RequestBody Dossier details) {
        return dossierRepository.findById(id).map(dossier -> {
            dossier.setReferenceAo(details.getReferenceAo());
            dossier.setIntituleAo(details.getIntituleAo());
            Dossier updatedDossier = dossierRepository.save(dossier);
            return ResponseEntity.ok(updatedDossier);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE dossier by ID
    @DeleteMapping("/dossiers/{id}")
    public ResponseEntity<Void> deleteDossier(@PathVariable int id) {
        return dossierRepository.findById(id).map(dossier -> {
            dossierRepository.delete(dossier);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
