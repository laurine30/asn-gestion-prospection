package com.asn.springbootbackend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idClient;

    @Column(name = "tel", nullable = false)
    private String tel;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "adresse", nullable = false)
    private String adresse;

    @Column(name = "sectActivite", nullable = false)
    private String sectActivite;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<AppelOffre> appelsOffres = new ArrayList<>();

    // CORRIGER ICI : mappedBy="client" au lieu de "appelOffre"
    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<Contrat> contrats = new ArrayList<>();

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<Prospection> prospections = new ArrayList<>();

    // Constructeurs
    public Client() {}

    public Client(int idClient, String tel, String email, String adresse, String sectActivite) {
        this.idClient = idClient;
        this.tel = tel;
        this.email = email;
        this.adresse = adresse;
        this.sectActivite = sectActivite;
    }

    // Getters et Setters
    public int getIdClient() { return idClient; }
    public void setIdClient(int idClient) { this.idClient = idClient; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getSectActivite() { return sectActivite; }
    public void setSectActivite(String sectActivite) { this.sectActivite = sectActivite; }

    public List<AppelOffre> getAppelsOffres() { return appelsOffres; }
    public void setAppelsOffres(List<AppelOffre> appelsOffres) { this.appelsOffres = appelsOffres; }

    public List<Contrat> getContrats() { return contrats; }
    public void setContrats(List<Contrat> contrats) { this.contrats = contrats; }

    public List<Prospection> getProspections() { return prospections; }
    public void setProspections(List<Prospection> prospections) { this.prospections = prospections; }
}