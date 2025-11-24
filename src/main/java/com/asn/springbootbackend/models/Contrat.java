package com.asn.springbootbackend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="contrat")
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idContrat;

    @Column(name = "dateSignature", nullable = false)
    private Date dateSignature;

    @Column(name = "conditions", nullable = false)
    private String conditions;

    @Column(name = "montantContrat", nullable = false)
    private Double montantContrat;

    @Column(name = "statutContrat", nullable = false)
    private String statutContrat;

    @OneToMany(mappedBy = "contrat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Facture> factures = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name="appel_offre_id")
    private AppelOffre appelOffre;

    // AJOUTER CETTE RELATION
    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name="type_id")
    private Type type;

    // Constructeurs
    public Contrat() {}

    public Contrat(Date dateSignature, String conditions, Double montantContrat, String statutContrat, Type type) {
        this.dateSignature = dateSignature;
        this.conditions = conditions;
        this.montantContrat = montantContrat;
        this.statutContrat = statutContrat;
        this.type = type;
    }

    // Getters et Setters existants...
    public int getIdContrat() { return idContrat; }
    public void setIdContrat(int idContrat) { this.idContrat = idContrat; }

    public Date getDateSignature() { return dateSignature; }
    public void setDateSignature(Date dateSignature) { this.dateSignature = dateSignature; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public Double getMontantContrat() { return montantContrat; }
    public void setMontantContrat(Double montantContrat) { this.montantContrat = montantContrat; }

    public String getStatutContrat() { return statutContrat; }
    public void setStatutContrat(String statutContrat) { this.statutContrat = statutContrat; }

    public List<Facture> getFactures() { return factures; }
    public void setFactures(List<Facture> factures) { this.factures = factures; }

    public Facture addFacture(Facture facture) {
        factures.add(facture);
        facture.setContrat(this);
        return facture;
    }

    public Facture removeFacture(Facture facture) {
        factures.remove(facture);
        facture.setContrat(null);
        return facture;
    }

    public AppelOffre getAppelOffre() { return appelOffre; }
    public void setAppelOffre(AppelOffre appelOffre) { this.appelOffre = appelOffre; }

    // AJOUTER CES GETTERS/SETTERS
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
}