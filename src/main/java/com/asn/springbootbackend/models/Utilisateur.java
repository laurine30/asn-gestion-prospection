package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name="utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUser;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "motDePasse", nullable = false)
    private String motDePasse;

    @Column(name = "userUpdate", nullable = false)
    private String userUpdate;

    @Column(name = "dateUpdate", nullable = false)
    private LocalDate dateUpdate;

    @Column(name = "email", nullable = false)
    private String email;

    // ✅ AJOUT DE L'ATTRIBUT ACTIF
    @Column(name = "actif", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean actif = true;  // Par défaut, l'utilisateur est actif

    @ManyToOne
    @JoinColumn(name = "idClient")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "idRole")
    private Role role;

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, String motDePasse, String email, String userUpdate, LocalDate dateUpdate) {
        this.nom = nom;
        this.prenom = prenom;
        this.motDePasse = motDePasse;
        this.email = email;
        this.userUpdate = userUpdate;
        this.dateUpdate = dateUpdate;
        this.actif = true;  // Par défaut actif
    }

    // Getters
    public int getIdUser() { return idUser; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getMotDePasse() { return motDePasse; }
    public String getEmail() { return email; }
    public String getUserUpdate() { return userUpdate; }
    public LocalDate getDateUpdate() { return dateUpdate; }
    public Client getClient() { return client; }
    public Role getRole() { return role; }

    // ✅ AJOUT DU GETTER POUR ACTIF
    public boolean isActif() { return actif; }

    // Setters
    public void setIdUser(int idUser) { this.idUser = idUser; }
    public void setNom(String nom) { this.nom = nom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public void setEmail(String email) { this.email = email; }
    public void setUserUpdate(String userUpdate) { this.userUpdate = userUpdate; }
    public void setDateUpdate(LocalDate dateUpdate) { this.dateUpdate = dateUpdate; }
    public void setClient(Client client) { this.client = client; }
    public void setRole(Role role) { this.role = role; }

    // ✅ AJOUT DU SETTER POUR ACTIF
    public void setActif(boolean actif) { this.actif = actif; }
}