package com.asn.springbootbackend.models;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "besoin")
public class Besoin {
    @EmbeddedId
    private BesoinPk id;

    @Column(name = "libelleBesoin", nullable = false)
    private String libelleBesoin;
    @Column(name = "description", nullable = false)
    private String description;
    @Column(name = "userUpdate", nullable = false)
    private String userUpdate;
    @Column(name = "dateUpdate", nullable = false)
    private String dateUpdate;



    public Besoin() {
    }

    public Besoin(String libelleBesoin, String description, String userUpdate, String dateUpdate) {
        this.libelleBesoin =  libelleBesoin;
        this.description = description;
        this.userUpdate = userUpdate;
        this.dateUpdate = dateUpdate;
    }

    public String getlibelleBesoin() {
        return libelleBesoin;
    }

    public String getDescription() {
        return description;
    }

    public String getUserUpdate() {
        return userUpdate;
    }

    public String getdateUpdate() {
        return dateUpdate;
    }


    public void setIntituleBesoin(String intituleBesoin) {

        this.libelleBesoin = libelleBesoin;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public void setUserUpdate(String userUpdate) {

        this.userUpdate = userUpdate;
    }

    public void setDateUpdate(String dateUpdate) {

        this.dateUpdate = dateUpdate;
    }
}
