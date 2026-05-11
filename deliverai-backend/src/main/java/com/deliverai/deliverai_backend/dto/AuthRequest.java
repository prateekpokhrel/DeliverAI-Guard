package com.deliverai.deliverai_backend.dto;

import lombok.*;

@Getter
@Setter
public class AuthRequest {

    private String email;

    private String password;
}