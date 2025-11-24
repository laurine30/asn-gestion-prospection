package com.asn.springbootbackend.repositories;


import com.asn.springbootbackend.models.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeRepository extends JpaRepository<Type, Integer>{
}

