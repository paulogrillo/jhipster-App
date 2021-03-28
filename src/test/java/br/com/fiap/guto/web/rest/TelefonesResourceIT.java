package br.com.fiap.guto.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.fiap.guto.IntegrationTest;
import br.com.fiap.guto.domain.Telefones;
import br.com.fiap.guto.repository.TelefonesRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TelefonesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TelefonesResourceIT {

    private static final Integer DEFAULT_PHONE_DDD = 1;
    private static final Integer UPDATED_PHONE_DDD = 2;

    private static final Integer DEFAULT_PHONE_NUMERO = 1;
    private static final Integer UPDATED_PHONE_NUMERO = 2;

    private static final String ENTITY_API_URL = "/api/telefones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TelefonesRepository telefonesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTelefonesMockMvc;

    private Telefones telefones;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Telefones createEntity(EntityManager em) {
        Telefones telefones = new Telefones().phoneDDD(DEFAULT_PHONE_DDD).phoneNumero(DEFAULT_PHONE_NUMERO);
        return telefones;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Telefones createUpdatedEntity(EntityManager em) {
        Telefones telefones = new Telefones().phoneDDD(UPDATED_PHONE_DDD).phoneNumero(UPDATED_PHONE_NUMERO);
        return telefones;
    }

    @BeforeEach
    public void initTest() {
        telefones = createEntity(em);
    }

    @Test
    @Transactional
    void createTelefones() throws Exception {
        int databaseSizeBeforeCreate = telefonesRepository.findAll().size();
        // Create the Telefones
        restTelefonesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(telefones)))
            .andExpect(status().isCreated());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeCreate + 1);
        Telefones testTelefones = telefonesList.get(telefonesList.size() - 1);
        assertThat(testTelefones.getPhoneDDD()).isEqualTo(DEFAULT_PHONE_DDD);
        assertThat(testTelefones.getPhoneNumero()).isEqualTo(DEFAULT_PHONE_NUMERO);
    }

    @Test
    @Transactional
    void createTelefonesWithExistingId() throws Exception {
        // Create the Telefones with an existing ID
        telefones.setId(1L);

        int databaseSizeBeforeCreate = telefonesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTelefonesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(telefones)))
            .andExpect(status().isBadRequest());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTelefones() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        // Get all the telefonesList
        restTelefonesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(telefones.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneDDD").value(hasItem(DEFAULT_PHONE_DDD)))
            .andExpect(jsonPath("$.[*].phoneNumero").value(hasItem(DEFAULT_PHONE_NUMERO)));
    }

    @Test
    @Transactional
    void getTelefones() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        // Get the telefones
        restTelefonesMockMvc
            .perform(get(ENTITY_API_URL_ID, telefones.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(telefones.getId().intValue()))
            .andExpect(jsonPath("$.phoneDDD").value(DEFAULT_PHONE_DDD))
            .andExpect(jsonPath("$.phoneNumero").value(DEFAULT_PHONE_NUMERO));
    }

    @Test
    @Transactional
    void getNonExistingTelefones() throws Exception {
        // Get the telefones
        restTelefonesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTelefones() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();

        // Update the telefones
        Telefones updatedTelefones = telefonesRepository.findById(telefones.getId()).get();
        // Disconnect from session so that the updates on updatedTelefones are not directly saved in db
        em.detach(updatedTelefones);
        updatedTelefones.phoneDDD(UPDATED_PHONE_DDD).phoneNumero(UPDATED_PHONE_NUMERO);

        restTelefonesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTelefones.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTelefones))
            )
            .andExpect(status().isOk());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
        Telefones testTelefones = telefonesList.get(telefonesList.size() - 1);
        assertThat(testTelefones.getPhoneDDD()).isEqualTo(UPDATED_PHONE_DDD);
        assertThat(testTelefones.getPhoneNumero()).isEqualTo(UPDATED_PHONE_NUMERO);
    }

    @Test
    @Transactional
    void putNonExistingTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, telefones.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(telefones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(telefones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(telefones)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTelefonesWithPatch() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();

        // Update the telefones using partial update
        Telefones partialUpdatedTelefones = new Telefones();
        partialUpdatedTelefones.setId(telefones.getId());

        partialUpdatedTelefones.phoneNumero(UPDATED_PHONE_NUMERO);

        restTelefonesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTelefones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTelefones))
            )
            .andExpect(status().isOk());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
        Telefones testTelefones = telefonesList.get(telefonesList.size() - 1);
        assertThat(testTelefones.getPhoneDDD()).isEqualTo(DEFAULT_PHONE_DDD);
        assertThat(testTelefones.getPhoneNumero()).isEqualTo(UPDATED_PHONE_NUMERO);
    }

    @Test
    @Transactional
    void fullUpdateTelefonesWithPatch() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();

        // Update the telefones using partial update
        Telefones partialUpdatedTelefones = new Telefones();
        partialUpdatedTelefones.setId(telefones.getId());

        partialUpdatedTelefones.phoneDDD(UPDATED_PHONE_DDD).phoneNumero(UPDATED_PHONE_NUMERO);

        restTelefonesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTelefones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTelefones))
            )
            .andExpect(status().isOk());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
        Telefones testTelefones = telefonesList.get(telefonesList.size() - 1);
        assertThat(testTelefones.getPhoneDDD()).isEqualTo(UPDATED_PHONE_DDD);
        assertThat(testTelefones.getPhoneNumero()).isEqualTo(UPDATED_PHONE_NUMERO);
    }

    @Test
    @Transactional
    void patchNonExistingTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, telefones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(telefones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(telefones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTelefones() throws Exception {
        int databaseSizeBeforeUpdate = telefonesRepository.findAll().size();
        telefones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTelefonesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(telefones))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Telefones in the database
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTelefones() throws Exception {
        // Initialize the database
        telefonesRepository.saveAndFlush(telefones);

        int databaseSizeBeforeDelete = telefonesRepository.findAll().size();

        // Delete the telefones
        restTelefonesMockMvc
            .perform(delete(ENTITY_API_URL_ID, telefones.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Telefones> telefonesList = telefonesRepository.findAll();
        assertThat(telefonesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
