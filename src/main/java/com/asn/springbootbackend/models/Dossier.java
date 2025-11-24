package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "Dossier")
public class Dossier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDossier;

    @Column(name = "referenceAo", nullable = false)
    private String referenceAo;
    @Column(name = "intituleAo", nullable = false)
    private String intituleAo;

    public Dossier() {
    }

    public Dossier(String referenceAo, String intituleAo) {
        this.referenceAo = referenceAo;
        this.intituleAo = intituleAo;
    }
    public int getIdDossier() {

        return idDossier;
    }

    public String getReferenceAo() {

        return referenceAo;
    }
    public String getIntituleAo() {
        return intituleAo;
    }
    public void setIdDossier(int idDossier) {
        this.idDossier = idDossier;
    }
    public void setReferenceAo(String referenceAo) {
        this.referenceAo = referenceAo;
    }
    public void setIntituleAo(String intituleAo) {
        this.intituleAo = intituleAo;
    }

}

