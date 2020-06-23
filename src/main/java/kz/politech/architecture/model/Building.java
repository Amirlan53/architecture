package kz.politech.architecture.model;

import javax.persistence.*;

@Entity
@Table(name = "building")
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 10000000)
    private String name;
    @Column(length = 10000000)
    private String kzName;
    @Column(length = 10000000)
    private String enName;
    @Column(length = 10000000)
    private String text;
    @Column(length = 10000000)
    private String kzText;
    @Column(length = 10000000)
    private String enText;
    private byte[] image;

    public String getKzName() {
        return kzName;
    }

    public void setKzName(String kzName) {
        this.kzName = kzName;
    }

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    public String getKzText() {
        return kzText;
    }

    public void setKzText(String kzText) {
        this.kzText = kzText;
    }

    public String getEnText() {
        return enText;
    }

    public void setEnText(String enText) {
        this.enText = enText;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
