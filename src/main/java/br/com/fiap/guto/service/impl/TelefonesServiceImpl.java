package br.com.fiap.guto.service.impl;

import br.com.fiap.guto.domain.Telefones;
import br.com.fiap.guto.repository.TelefonesRepository;
import br.com.fiap.guto.service.TelefonesService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Telefones}.
 */
@Service
@Transactional
public class TelefonesServiceImpl implements TelefonesService {

    private final Logger log = LoggerFactory.getLogger(TelefonesServiceImpl.class);

    private final TelefonesRepository telefonesRepository;

    public TelefonesServiceImpl(TelefonesRepository telefonesRepository) {
        this.telefonesRepository = telefonesRepository;
    }

    @Override
    public Telefones save(Telefones telefones) {
        log.debug("Request to save Telefones : {}", telefones);
        return telefonesRepository.save(telefones);
    }

    @Override
    public Optional<Telefones> partialUpdate(Telefones telefones) {
        log.debug("Request to partially update Telefones : {}", telefones);

        return telefonesRepository
            .findById(telefones.getId())
            .map(
                existingTelefones -> {
                    if (telefones.getPhoneDDD() != null) {
                        existingTelefones.setPhoneDDD(telefones.getPhoneDDD());
                    }
                    if (telefones.getPhoneNumero() != null) {
                        existingTelefones.setPhoneNumero(telefones.getPhoneNumero());
                    }

                    return existingTelefones;
                }
            )
            .map(telefonesRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Telefones> findAll(Pageable pageable) {
        log.debug("Request to get all Telefones");
        return telefonesRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Telefones> findOne(Long id) {
        log.debug("Request to get Telefones : {}", id);
        return telefonesRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Telefones : {}", id);
        telefonesRepository.deleteById(id);
    }
}
