package br.com.fiap.guto.web.rest;

import br.com.fiap.guto.domain.Telefones;
import br.com.fiap.guto.repository.TelefonesRepository;
import br.com.fiap.guto.service.TelefonesService;
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
 * REST controller for managing {@link br.com.fiap.guto.domain.Telefones}.
 */
@RestController
@RequestMapping("/api")
public class TelefonesResource {

    private final Logger log = LoggerFactory.getLogger(TelefonesResource.class);

    private static final String ENTITY_NAME = "telefones";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TelefonesService telefonesService;

    private final TelefonesRepository telefonesRepository;

    public TelefonesResource(TelefonesService telefonesService, TelefonesRepository telefonesRepository) {
        this.telefonesService = telefonesService;
        this.telefonesRepository = telefonesRepository;
    }

    /**
     * {@code POST  /telefones} : Create a new telefones.
     *
     * @param telefones the telefones to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new telefones, or with status {@code 400 (Bad Request)} if the telefones has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/telefones")
    public ResponseEntity<Telefones> createTelefones(@RequestBody Telefones telefones) throws URISyntaxException {
        log.debug("REST request to save Telefones : {}", telefones);
        if (telefones.getId() != null) {
            throw new BadRequestAlertException("A new telefones cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Telefones result = telefonesService.save(telefones);
        return ResponseEntity
            .created(new URI("/api/telefones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /telefones/:id} : Updates an existing telefones.
     *
     * @param id the id of the telefones to save.
     * @param telefones the telefones to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated telefones,
     * or with status {@code 400 (Bad Request)} if the telefones is not valid,
     * or with status {@code 500 (Internal Server Error)} if the telefones couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/telefones/{id}")
    public ResponseEntity<Telefones> updateTelefones(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Telefones telefones
    ) throws URISyntaxException {
        log.debug("REST request to update Telefones : {}, {}", id, telefones);
        if (telefones.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, telefones.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!telefonesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Telefones result = telefonesService.save(telefones);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, telefones.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /telefones/:id} : Partial updates given fields of an existing telefones, field will ignore if it is null
     *
     * @param id the id of the telefones to save.
     * @param telefones the telefones to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated telefones,
     * or with status {@code 400 (Bad Request)} if the telefones is not valid,
     * or with status {@code 404 (Not Found)} if the telefones is not found,
     * or with status {@code 500 (Internal Server Error)} if the telefones couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/telefones/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Telefones> partialUpdateTelefones(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Telefones telefones
    ) throws URISyntaxException {
        log.debug("REST request to partial update Telefones partially : {}, {}", id, telefones);
        if (telefones.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, telefones.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!telefonesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Telefones> result = telefonesService.partialUpdate(telefones);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, telefones.getId().toString())
        );
    }

    /**
     * {@code GET  /telefones} : get all the telefones.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of telefones in body.
     */
    @GetMapping("/telefones")
    public ResponseEntity<List<Telefones>> getAllTelefones(Pageable pageable) {
        log.debug("REST request to get a page of Telefones");
        Page<Telefones> page = telefonesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /telefones/:id} : get the "id" telefones.
     *
     * @param id the id of the telefones to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the telefones, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/telefones/{id}")
    public ResponseEntity<Telefones> getTelefones(@PathVariable Long id) {
        log.debug("REST request to get Telefones : {}", id);
        Optional<Telefones> telefones = telefonesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(telefones);
    }

    /**
     * {@code DELETE  /telefones/:id} : delete the "id" telefones.
     *
     * @param id the id of the telefones to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/telefones/{id}")
    public ResponseEntity<Void> deleteTelefones(@PathVariable Long id) {
        log.debug("REST request to delete Telefones : {}", id);
        telefonesService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
