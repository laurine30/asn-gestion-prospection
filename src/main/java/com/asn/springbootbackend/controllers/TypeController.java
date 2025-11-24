package com.asn.springbootbackend.controllers;

import com.asn.springbootbackend.models.Type;
import com.asn.springbootbackend.repositories.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/types")
public class TypeController {

    @Autowired
    private TypeRepository typeRepository;

    // GET : Tous les types
    @GetMapping
    public List<Type> getAllTypes() {
        return typeRepository.findAll();
    }

    // GET : Récupérer un type par ID
    @GetMapping("/{id}")
    public ResponseEntity<Type> getTypeById(@PathVariable int id) {
        return typeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST : Créer un nouveau type
    @PostMapping
    public Type createType(@RequestBody Type type) {
        return typeRepository.save(type);
    }

    // PUT : Mettre à jour un type existant
    @PutMapping("/{id}")
    public ResponseEntity<Type> updateType(@PathVariable int id, @RequestBody Type details) {
        return typeRepository.findById(id).map(type -> {
            type.setLibelleType(details.getLibelleType());
            // Si besoin, gérer les contrats séparément
            Type updatedType = typeRepository.save(type);
            return ResponseEntity.ok(updatedType);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE : Supprimer un type par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable int id) {
        return typeRepository.findById(id).map(type -> {
            typeRepository.delete(type);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
