package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Client;
import com.asn.springbootbackend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;


    // GET : Tous les clients

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }


    // GET : Client par ID

    @GetMapping("/{id}")
    public Client getClientById(@PathVariable int id) {

        // LOGIQUE METIER : Vérifier si le client existe
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Client introuvable avec l’ID : " + id
                ));
    }

    // ---------------------------------------------------------------
    // POST : Créer un client
    // ---------------------------------------------------------------
    @PostMapping
    public Client createClient(@RequestBody Client client) {

        // LOGIQUE METIER : (exemple) vérifier email obligatoire
        if (client.getEmail() == null || client.getEmail().isEmpty()) {
            throw new RuntimeException("L'email est obligatoire !");
        }

        return clientRepository.save(client);
    }

    // ---------------------------------------------------------------
    // PUT : Modifier un client
    // ---------------------------------------------------------------
    @PutMapping("/{id}")
    public Client updateClient(
            @PathVariable int id,
            @RequestBody Client details
    ) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Client introuvable avec l’ID : " + id
                ));

        // ******** LOGIQUE METIER ********
        // On met à jour uniquement les champs qui ont été envoyés

        if (details.getTel() != null) {
            client.setTel(details.getTel());
        }
        if (details.getEmail() != null) {
            client.setEmail(details.getEmail());
        }
        if (details.getAdresse() != null) {
            client.setAdresse(details.getAdresse());
        }
        if (details.getSectActivite() != null) {
            client.setSectActivite(details.getSectActivite());
        }

        // Sauvegarde
        return clientRepository.save(client);
    }

    // ---------------------------------------------------------------
    // DELETE : Supprimer un client
    // ---------------------------------------------------------------
    @DeleteMapping("/{id}")
    public String deleteClient(@PathVariable int id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Client introuvable avec l’ID : " + id
                ));

        clientRepository.delete(client);

        return "Client avec ID " + id + " supprimé avec succès !";
    }
}
