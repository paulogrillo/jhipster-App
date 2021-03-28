package br.com.fiap.guto.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.fiap.guto.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TelefonesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Telefones.class);
        Telefones telefones1 = new Telefones();
        telefones1.setId(1L);
        Telefones telefones2 = new Telefones();
        telefones2.setId(telefones1.getId());
        assertThat(telefones1).isEqualTo(telefones2);
        telefones2.setId(2L);
        assertThat(telefones1).isNotEqualTo(telefones2);
        telefones1.setId(null);
        assertThat(telefones1).isNotEqualTo(telefones2);
    }
}
