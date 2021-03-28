package br.com.fiap.guto.repository;

import br.com.fiap.guto.domain.Telefones;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Telefones entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TelefonesRepository extends JpaRepository<Telefones, Long> {}
