package com.asn.springbootbackend.models;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.util.Date;
import java.util.Objects;

@Embeddable
public class BesoinPk {

    @Column(name = "idClient", nullable = false)
    private int idClient;
    @Column(name = "idProspection", nullable = false)
    private int idProspection;


    public BesoinPk() {
    }

    public BesoinPk(int idClient, int idProspection) {
        this.idClient = idClient;
        this.idProspection = idProspection;
    }

    public int getIdClient() {
        return idClient;
    }

    public int getIdProspection() {
        return idProspection;
    }

    public void setIdClient(int  idClient) {
        this.idClient = idClient;
    }

    public void setIdProspection(int  idProspection) {
        this.idProspection = idProspection;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        BesoinPk besoinPk = (BesoinPk) o;
        return idClient == besoinPk.idClient && idProspection == besoinPk.idProspection;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idClient, idProspection);
    }
}
