package br.com.fiap.guto.service;

import br.com.fiap.guto.domain.Telefones;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Telefones}.
 */
public interface TelefonesService {
    /**
     * Save a telefones.
     *
     * @param telefones the entity to save.
     * @return the persisted entity.
     */
    Telefones save(Telefones telefones);

    /**
     * Partially updates a telefones.
     *
     * @param telefones the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Telefones> partialUpdate(Telefones telefones);

    /**
     * Get all the telefones.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Telefones> findAll(Pageable pageable);

    /**
     * Get the "id" telefones.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Telefones> findOne(Long id);

    /**
     * Delete the "id" telefones.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
