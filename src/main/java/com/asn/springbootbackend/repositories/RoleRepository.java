package com.asn.springbootbackend.repositories;

import com.asn.springbootbackend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer>{
    boolean existsByLibRole(String libRole);

    Role findByLibRole(String libRole);
}