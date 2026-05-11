package com.deliverai.deliverai_backend.dto;

import lombok.*;

@Getter
@Setter
public class RegisterRequest {

    private String name;

    private String email;

    private String password;
}