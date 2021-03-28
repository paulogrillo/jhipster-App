package br.com.fiap.guto.service.impl;

import br.com.fiap.guto.domain.Login;
import br.com.fiap.guto.repository.LoginRepository;
import br.com.fiap.guto.service.LoginService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Login}.
 */
@Service
@Transactional
public class LoginServiceImpl implements LoginService {

    private final Logger log = LoggerFactory.getLogger(LoginServiceImpl.class);

    private final LoginRepository loginRepository;

    public LoginServiceImpl(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    @Override
    public Login save(Login login) {
        log.debug("Request to save Login : {}", login);
        return loginRepository.save(login);
    }

    @Override
    public Optional<Login> partialUpdate(Login login) {
        log.debug("Request to partially update Login : {}", login);

        return loginRepository
            .findById(login.getId())
            .map(
                existingLogin -> {
                    if (login.getLogin() != null) {
                        existingLogin.setLogin(login.getLogin());
                    }
                    if (login.getPassword() != null) {
                        existingLogin.setPassword(login.getPassword());
                    }

                    return existingLogin;
                }
            )
            .map(loginRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Login> findAll(Pageable pageable) {
        log.debug("Request to get all Logins");
        return loginRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Login> findOne(Long id) {
        log.debug("Request to get Login : {}", id);
        return loginRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Login : {}", id);
        loginRepository.deleteById(id);
    }
}
