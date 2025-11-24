package com.asn.springbootbackend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="appel_offre")
public class AppelOffre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAo;

    @Column(name = "titre", nullable = false)
    private String titre;

    @Column(name = "date_public", nullable = false)
    private LocalDate datePublic;

    @Column(name = "date_rponse")
    private LocalDate dateRponse;   // CHANGÉ: Date → LocalDate

    @Column(name = "statut")
    private String statut;          // AJOUTÉ : utilisé dans le controller !

    @Column(name= "user_update")
    private String userUpdate;

    @Column(name= "date_update")
    private LocalDate dateUpdate;

    @ManyToOne
    @JoinColumn(name="client_id")
    private Client client;

    @OneToMany(mappedBy="appelOffre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contrat> contrats = new ArrayList<>();

    // Constructeur
    public AppelOffre() {}

    public AppelOffre(String titre, LocalDate datePublic, LocalDate dateRponse, String userUpdate, LocalDate dateUpdate, String statut) {
        this.titre = titre;
        this.datePublic = datePublic;
        this.dateRponse = dateRponse;
        this.userUpdate = userUpdate;
        this.dateUpdate = dateUpdate;
        this.statut = statut;
    }

    // GETTERS / SETTERS
    public int getIdAo() { return idAo; }
    public void setIdAo(int idAo) { this.idAo = idAo; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public LocalDate getDatePublic() { return datePublic; }
    public void setDatePublic(LocalDate datePublic) { this.datePublic = datePublic; }

    public LocalDate getDateRponse() { return dateRponse; }
    public void setDateRponse(LocalDate dateRponse) { this.dateRponse = dateRponse; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getUserUpdate() { return userUpdate; }
    public void setUserUpdate(String userUpdate) { this.userUpdate = userUpdate; }

    public LocalDate getDateUpdate() { return dateUpdate; }
    public void setDateUpdate(LocalDate dateUpdate) { this.dateUpdate = dateUpdate; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public List<Contrat> getContrats() { return contrats; }
    public void setContrats(List<Contrat> contrats) { this.contrats = contrats; }

    // Gestion de la liste de contrats
    public void addContrat(Contrat contrat) {
        contrats.add(contrat);
        contrat.setAppelOffre(this);
    }

    public void removeContrat(Contrat contrat) {
        contrats.remove(contrat);
        contrat.setAppelOffre(null);
    }
}
