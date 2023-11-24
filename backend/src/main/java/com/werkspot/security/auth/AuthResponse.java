package com.werkspot.security.auth;

import lombok.*;

import java.io.Serial;
import java.io.Serializable;
public class AuthResponse {

    private String token;
    private String refresh;

    public AuthResponse(String token) {
        this.token = token;
        this.refresh = null;
    }

    public AuthResponse(String token, String refresh) {
        this.token = token;
        this.refresh = refresh;
    }

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token the token to set
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * @return the refresh
     */
    public String getRefresh() {
        return refresh;
    }

    /**
     * @param refresh the refresh to set
     */
    public void setRefresh(String refresh) {
        this.refresh = refresh;
    }



}