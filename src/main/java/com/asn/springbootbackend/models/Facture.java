package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "facture")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idFacture;

    @Column(name = "dateEmition", nullable = false)
    private LocalDate dateEmition;

    @Column(name = "num", nullable = false)
    private int num;

    @Column(name = "etatPaie", nullable = false)
    private int etatPaie;

    @Column(name = "dateEcheance", nullable = false)
    private LocalDate dateEcheance;

    @Column(name = "tauxTva", nullable = false)
    private int tauxTva;

    @Column(name = "mentionLegale", nullable = false)
    private String mentionLegal;

    @Column(name = "statut", nullable = false)
    private String statut;

    @ManyToOne
    @JoinColumn(name = "idContrat")
    private Contrat contrat;

    @OneToMany(mappedBy = "facture")
    private List<Paiement> paiements;



    public Facture() {
    }

    public Facture(LocalDate dateEmition, LocalDate dateEcheance, int num, int etatPaie, int tauxTva, String mentionLegale, String statut ) {
        this.dateEmition = dateEmition;
        this.num = num;
        this.etatPaie = etatPaie;
        this.tauxTva = tauxTva;
        this.mentionLegal = mentionLegale;
        this.statut = statut;
        this.dateEcheance = dateEcheance;
    }

    // Getters
    public int getIdFacture() { return idFacture; }
    public LocalDate getDateEmition() { return dateEmition; }
    public int getNum() { return num; }
    public int getEtatPaie() { return etatPaie; }
    public LocalDate getDateEcheance() { return dateEcheance; }
    public int getTauxTva() { return tauxTva; }
    public String getMentionLegale() { return mentionLegal; }
    public String getStatut() { return statut; }
    public Contrat getContrat() { return contrat; }
    public List<Paiement> getPaiements() { return paiements; }

    // Setters
    public void setIdFacture(int idFacture) { this.idFacture = idFacture; }
    public void setDateEmition(LocalDate dateEmition) { this.dateEmition = dateEmition; }
    public void setNum(int num) { this.num = num; }
    public void setEtatPaie(int etatPaie) { this.etatPaie = etatPaie; }
    public void setDateEcheance(LocalDate dateEcheance) { this.dateEcheance = dateEcheance; }
    public void setTauxTva(int tauxTva) { this.tauxTva = tauxTva; }
    public void setMentionLegal(String mentionLegal) { this.mentionLegal = mentionLegal; }
    public void setStatut(String statut) { this.statut = statut; }
    public void setContrat(Contrat contrat) { this.contrat = contrat; }

    public void setPaiements(List<Paiement> paiements) { this.paiements = paiements; }

    // Méthodes pour gérer la liste de paiements
    public Paiement addPaiements(Paiement paiement) {
        getPaiements().add(paiement);
        paiement.setFacture(this);
        return paiement;
    }

    public Paiement removePaiements(Paiement paiement) {
        getPaiements().remove(paiement);
        paiement.setFacture(null);
        return paiement;
    }
}
