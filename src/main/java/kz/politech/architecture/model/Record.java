package kz.politech.architecture.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "record")
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String url;
    @Column
    @ElementCollection(targetClass=String.class)
    private List<String> whoLiked;

    public List<String> getWhoLiked() {
        return whoLiked;
    }

    public void setWhoLiked(List<String> whoLiked) {
        this.whoLiked = whoLiked;
    }

    private int likes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
}
