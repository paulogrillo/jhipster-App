package br.com.fiap.guto.service;

import br.com.fiap.guto.domain.Login;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Login}.
 */
public interface LoginService {
    /**
     * Save a login.
     *
     * @param login the entity to save.
     * @return the persisted entity.
     */
    Login save(Login login);

    /**
     * Partially updates a login.
     *
     * @param login the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Login> partialUpdate(Login login);

    /**
     * Get all the logins.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Login> findAll(Pageable pageable);

    /**
     * Get the "id" login.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Login> findOne(Long id);

    /**
     * Delete the "id" login.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
