package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.AppelOffre;
import com.asn.springbootbackend.models.Client;
import com.asn.springbootbackend.repositories.AppelOffreRepository;
import com.asn.springbootbackend.repositories.ClientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appelOffres")
public class AppelOffreController {

    @Autowired
    private AppelOffreRepository appelOffreRepository;

    @Autowired
    private ClientRepository clientRepository;

    // GET : Tous les Appels d’Offres
    @GetMapping
    public List<AppelOffre> getAllAppelOffres() {
        return appelOffreRepository.findAll();
    }

    // GET : Appel d’offre par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppelOffreById(@PathVariable int id) {

        var ao = appelOffreRepository.findById(id);

        if (ao.isPresent()) {
            return ResponseEntity.ok(ao.get());
        }

        return ResponseEntity.badRequest().body("AO introuvable !");
    }


    // POST : Création d’un AO AVEC logique métier
    @PostMapping
    public ResponseEntity<?> createAppelOffre(@RequestBody AppelOffre ao) {

        // 1. Vérifier la date réponse
        if (ao.getDateRponse() != null &&
                ao.getDateRponse().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest()
                    .body("La date de réponse ne peut pas être dans le passé !");
        }

        // 2. Date de publication automatique
        ao.setDatePublic(LocalDate.now());

        // 3. Statut par défaut
        ao.setStatut("Ouvert");

        // 4. DateUpdate automatiquement maintenant
        ao.setDateUpdate(LocalDate.now());

        AppelOffre saved = appelOffreRepository.save(ao);
        return ResponseEntity.ok(saved);
    }

    // PUT : Mise à jour d’un AO
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppelOffre(@PathVariable int id, @RequestBody AppelOffre details) {

        return appelOffreRepository.findById(id).map(a -> {

            a.setTitre(details.getTitre());

            // Vérification date réponse
            if (details.getDateRponse() != null &&
                    details.getDateRponse().isBefore(LocalDate.now()))
            {
                return ResponseEntity.badRequest()
                        .body("Date réponse invalide !");
            }

            a.setDateRponse(details.getDateRponse());
            a.setUserUpdate(details.getUserUpdate());
            a.setDateUpdate(LocalDate.now());
            a.setClient(details.getClient());

            return ResponseEntity.ok(appelOffreRepository.save(a));

        }).orElse(ResponseEntity.badRequest().body("AO introuvable !"));
    }

    // DELETE : Suppression d’un AO
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppelOffre(@PathVariable int id) {

        return appelOffreRepository.findById(id).map(a -> {

            // Règle métier : impossible de supprimer un AO déjà attribué
            if ("Attribué".equalsIgnoreCase(a.getStatut())) {
                return ResponseEntity.badRequest()
                        .body("Impossible de supprimer un AO attribué !");
            }

            appelOffreRepository.delete(a);
            return ResponseEntity.noContent().build();

        }).orElse(ResponseEntity.badRequest().body("AO introuvable !"));
    }

    // PATCH : Changer le statut d’un AO
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changeStatutAO(
            @PathVariable int id,
            @RequestParam String statut) {

        return appelOffreRepository.findById(id).map(ao -> {

            // Liste statuts autorisés
            if (!List.of("Ouvert", "En analyse", "Attribué", "Clôturé")
                    .contains(statut)) {
                return ResponseEntity.badRequest()
                        .body("Statut invalide !");
            }

            ao.setStatut(statut);
            ao.setDateUpdate(LocalDate.now());

            appelOffreRepository.save(ao);

            return ResponseEntity.ok("Statut modifié avec succès !");
        }).orElse(ResponseEntity.badRequest().body("AO introuvable !"));
    }

    // PATCH : Associer un client à un AO
    @PatchMapping("/{idAO}/client/{idClient}")
    public ResponseEntity<?> associerClient(
            @PathVariable int idAO,
            @PathVariable int idClient) {

        AppelOffre ao = appelOffreRepository.findById(idAO)
                .orElse(null);
        if (ao == null)
            return ResponseEntity.badRequest().body("AO introuvable !");

        Client client = clientRepository.findById(idClient)
                .orElse(null);
        if (client == null)
            return ResponseEntity.badRequest().body("Client introuvable !");

        ao.setClient(client);
        ao.setDateUpdate(LocalDate.now());

        appelOffreRepository.save(ao);

        return ResponseEntity.ok("Client associé avec succès !");
    }
}
