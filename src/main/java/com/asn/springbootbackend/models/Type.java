package com.asn.springbootbackend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "type")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idType;

    @Column(name = "libelleType", nullable = false)
    private String libelleType;

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL)
    private List<Contrat> contrats = new ArrayList<>();

    public Type() {
    }

    public Type(int idType, String libelleType) {
        this.idType = idType;
        this.libelleType = libelleType;
    }

    public int getIdType() {
        return idType;
    }

    public void setIdType(int idType) {
        this.idType = idType;
    }

    public String getLibelleType() {
        return libelleType;
    }

    public void setLibelleType(String libelleType) {
        this.libelleType = libelleType;
    }

    public List<Contrat> getContrats() {
        return contrats;
    }

    public void setContrats(List<Contrat> contrats) {
        this.contrats = contrats;
    }

    // Méthodes pour gérer la liste de contrats
    public Contrat addContrat(Contrat contrat) {
        contrats.add(contrat);
        contrat.setType(this);
        return contrat;
    }

    public Contrat removeContrat(Contrat contrat) {
        contrats.remove(contrat);
        contrat.setType(null);
        return contrat;
    }
}