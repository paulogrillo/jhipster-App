package br.com.fiap.guto.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Telefones.
 */
@Entity
@Table(name = "telefones")
public class Telefones implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "phone_ddd")
    private Integer phoneDDD;

    @Column(name = "phone_numero")
    private Integer phoneNumero;

    @ManyToOne
    @JsonIgnoreProperties(value = { "telefones" }, allowSetters = true)
    private Usuario ddd;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Telefones id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getPhoneDDD() {
        return this.phoneDDD;
    }

    public Telefones phoneDDD(Integer phoneDDD) {
        this.phoneDDD = phoneDDD;
        return this;
    }

    public void setPhoneDDD(Integer phoneDDD) {
        this.phoneDDD = phoneDDD;
    }

    public Integer getPhoneNumero() {
        return this.phoneNumero;
    }

    public Telefones phoneNumero(Integer phoneNumero) {
        this.phoneNumero = phoneNumero;
        return this;
    }

    public void setPhoneNumero(Integer phoneNumero) {
        this.phoneNumero = phoneNumero;
    }

    public Usuario getDdd() {
        return this.ddd;
    }

    public Telefones ddd(Usuario usuario) {
        this.setDdd(usuario);
        return this;
    }

    public void setDdd(Usuario usuario) {
        this.ddd = usuario;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Telefones)) {
            return false;
        }
        return id != null && id.equals(((Telefones) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Telefones{" +
            "id=" + getId() +
            ", phoneDDD=" + getPhoneDDD() +
            ", phoneNumero=" + getPhoneNumero() +
            "}";
    }
}
