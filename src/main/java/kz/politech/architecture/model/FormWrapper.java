package kz.politech.architecture.model;

import org.springframework.web.multipart.MultipartFile;

public class FormWrapper {
    private MultipartFile image;
    private String name;
    private String kzName;
    private String enName;
    private String kzText;
    private String enText;
    private String text;

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

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}