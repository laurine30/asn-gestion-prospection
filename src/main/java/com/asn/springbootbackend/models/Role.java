package com.asn.springbootbackend.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRole;

    @Column(name = "libRole", nullable = false)
    private String libRole;

    @Column(name = "userUpdate", nullable = false)
    private String userUpdate;

    @Column(name = "dateUpdate", nullable = false)
    private LocalDate dateUpdate;

    @OneToMany(mappedBy = "role")
    private List<Utilisateur> utilisateurs = new ArrayList<>();

    public Role() {}

    public Role(String libRole, String userUpdate,LocalDate dateUpdate) {
        this.libRole = libRole;
        this.userUpdate = userUpdate;
        this.dateUpdate = dateUpdate;
    }

    // Getters
    public int getIdRole() { return idRole; }
    public String getLibRole() { return libRole; }
    public String getUserUpdate() { return userUpdate; }
    public LocalDate getDateUpdate() { return dateUpdate; }
    public List<Utilisateur> getUtilisateurs() { return utilisateurs; }

    // Setters
    public void setLibRole(String libRole) { this.libRole = libRole; }
    public void setUserUpdate(String userUpdate) { this.userUpdate = userUpdate; }
    public void setDateUpdate(LocalDate dateUpdate) { this.dateUpdate = dateUpdate; }
    public void setUtilisateurs(List<Utilisateur> utilisateurs) { this.utilisateurs = utilisateurs; }
}
