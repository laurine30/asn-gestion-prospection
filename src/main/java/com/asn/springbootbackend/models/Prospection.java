package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "prospection")
public class Prospection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idProspection;

    @Column(name = "statut", nullable = false)
    private String statut;

    @Column(name = "datePublication", nullable = false)
    private LocalDate datePublication;

    @Column(name = "userUpdate", nullable = false)
    private String userUpdate;

    @Column(name = "dateUpdate", nullable = false)
    private LocalDate dateUpdate;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    private Client client;

    // Ajoute si besoin : relation avec services
    // @ManyToMany(mappedBy = "prospections") private List<Service> services;

    public Prospection() {}

    public Prospection(LocalDate datePublication, String statut, String userUpdate, LocalDate dateUpdate, Client client) {
        this.datePublication = datePublication;
        this.statut = statut;
        this.userUpdate = userUpdate;
        this.dateUpdate = dateUpdate;
        this.client = client;
    }

    // Getters
    public int getIdProspection() { return idProspection; }
    public String getStatut() { return statut; }
    public LocalDate getDatePublication() { return datePublication; }
    public String getUserUpdate() { return userUpdate; }
    public LocalDate getDateUpdate() { return dateUpdate; }
    public Client getClient() { return client; }

    // Setters
    public void setIdProspection(int idProspection) { this.idProspection = idProspection; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setDatePublication(LocalDate datePublication) { this.datePublication = datePublication; }
    public void setUserUpdate(String userUpdate) { this.userUpdate = userUpdate; }
    public void setDateUpdate(LocalDate dateUpdate) { this.dateUpdate = dateUpdate; }
    public void setClient(Client client) { this.client = client; }
}
