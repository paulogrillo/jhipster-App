package br.com.fiap.guto.web.rest;

import br.com.fiap.guto.domain.Login;
import br.com.fiap.guto.repository.LoginRepository;
import br.com.fiap.guto.service.LoginService;
import br.com.fiap.guto.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.fiap.guto.domain.Login}.
 */
@RestController
@RequestMapping("/api")
public class LoginResource {

    private final Logger log = LoggerFactory.getLogger(LoginResource.class);

    private static final String ENTITY_NAME = "login";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoginService loginService;

    private final LoginRepository loginRepository;

    public LoginResource(LoginService loginService, LoginRepository loginRepository) {
        this.loginService = loginService;
        this.loginRepository = loginRepository;
    }

    /**
     * {@code POST  /logins} : Create a new login.
     *
     * @param login the login to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new login, or with status {@code 400 (Bad Request)} if the login has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/logins")
    public ResponseEntity<Login> createLogin(@RequestBody Login login) throws URISyntaxException {
        log.debug("REST request to save Login : {}", login);
        if (login.getId() != null) {
            throw new BadRequestAlertException("A new login cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Login result = loginService.save(login);
        return ResponseEntity
            .created(new URI("/api/logins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /logins/:id} : Updates an existing login.
     *
     * @param id the id of the login to save.
     * @param login the login to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated login,
     * or with status {@code 400 (Bad Request)} if the login is not valid,
     * or with status {@code 500 (Internal Server Error)} if the login couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/logins/{id}")
    public ResponseEntity<Login> updateLogin(@PathVariable(value = "id", required = false) final Long id, @RequestBody Login login)
        throws URISyntaxException {
        log.debug("REST request to update Login : {}, {}", id, login);
        if (login.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, login.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loginRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Login result = loginService.save(login);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, login.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /logins/:id} : Partial updates given fields of an existing login, field will ignore if it is null
     *
     * @param id the id of the login to save.
     * @param login the login to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated login,
     * or with status {@code 400 (Bad Request)} if the login is not valid,
     * or with status {@code 404 (Not Found)} if the login is not found,
     * or with status {@code 500 (Internal Server Error)} if the login couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/logins/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Login> partialUpdateLogin(@PathVariable(value = "id", required = false) final Long id, @RequestBody Login login)
        throws URISyntaxException {
        log.debug("REST request to partial update Login partially : {}, {}", id, login);
        if (login.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, login.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loginRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Login> result = loginService.partialUpdate(login);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, login.getId().toString())
        );
    }

    /**
     * {@code GET  /logins} : get all the logins.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of logins in body.
     */
    @GetMapping("/logins")
    public ResponseEntity<List<Login>> getAllLogins(Pageable pageable) {
        log.debug("REST request to get a page of Logins");
        Page<Login> page = loginService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /logins/:id} : get the "id" login.
     *
     * @param id the id of the login to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the login, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/logins/{id}")
    public ResponseEntity<Login> getLogin(@PathVariable Long id) {
        log.debug("REST request to get Login : {}", id);
        Optional<Login> login = loginService.findOne(id);
        return ResponseUtil.wrapOrNotFound(login);
    }

    /**
     * {@code DELETE  /logins/:id} : delete the "id" login.
     *
     * @param id the id of the login to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/logins/{id}")
    public ResponseEntity<Void> deleteLogin(@PathVariable Long id) {
        log.debug("REST request to delete Login : {}", id);
        loginService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
