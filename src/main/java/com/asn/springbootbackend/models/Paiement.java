package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPaie;

    @Column(name = "datePaie", nullable = false)
    private LocalDate datePaiement;

    @Column(name = "montant", nullable = false)
    private double montant;

    @Column(name = "modePaie", nullable = false)
    private String modePaiement;

    @ManyToOne
    @JoinColumn(name = "idFacture")
    private Facture facture;

    public Paiement() {}

    public Paiement(int idPaie, LocalDate datePaiement, double montant, String modePaiement) {
        this.idPaie = idPaie;
        this.datePaiement = datePaiement;
        this.montant = montant;
        this.modePaiement = modePaiement;
    }

    public int getIdPaie() {
        return idPaie;
    }

    public void setIdPaie(int idPaie) {
        this.idPaie = idPaie;
    }

    public LocalDate getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDate datePaiement) {
        this.datePaiement = datePaiement;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public String getModePaiement() {
        return modePaiement;
    }

    public void setModePaiement(String modePaiement) {
        this.modePaiement = modePaiement;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }
}
