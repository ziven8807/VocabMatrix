--
-- PostgreSQL database dump
--


-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: cleanup_expired_otp_codes(); Type: FUNCTION; Schema: public; Owner: depravationdo
--

CREATE FUNCTION public.cleanup_expired_otp_codes() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM otp_codes
    -- 刪除所有已經過期的令牌
    WHERE expiry_date < CURRENT_TIMESTAMP
       -- 刪除所有已使用，且已使用超過 7 天的令牌（防止誤刪，給予緩衝期）
       OR (is_used = TRUE AND used_at < CURRENT_TIMESTAMP - INTERVAL '7 days');
END;
$$;



--
-- Name: cleanup_expired_registration_tokens(); Type: FUNCTION; Schema: public; Owner: depravationdo
--

CREATE FUNCTION public.cleanup_expired_registration_tokens() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM registration_email_tokens
    WHERE expiry_date < CURRENT_TIMESTAMP - INTERVAL '7 days'
       OR (is_used = TRUE AND used_at < CURRENT_TIMESTAMP - INTERVAL '7 days');
END;
$$;



--
-- Name: cleanup_expired_reset_tokens(); Type: FUNCTION; Schema: public; Owner: depravationdo
--

CREATE FUNCTION public.cleanup_expired_reset_tokens() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM password_reset_tokens
    WHERE expiry_date < CURRENT_TIMESTAMP - INTERVAL '7 days';
END;
$$;



--
-- Name: cleanup_expired_verification_tokens(); Type: FUNCTION; Schema: public; Owner: depravationdo
--

CREATE FUNCTION public.cleanup_expired_verification_tokens() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM email_verification_tokens
    WHERE expiry_date < CURRENT_TIMESTAMP - INTERVAL '7 days'
       OR (is_used = TRUE AND used_at < CURRENT_TIMESTAMP - INTERVAL '7 days');
END;
$$;



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: depravationdo
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP; -- 將要寫入的新資料時間設為現在
    RETURN NEW;
END;
$$;



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_deletion_logs; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.account_deletion_logs (
    id bigint NOT NULL,
    user_id bigint,
    username character varying(30) NOT NULL,
    action character varying(50) NOT NULL,
    reason_category character varying(50),
    detail text,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: account_deletion_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.account_deletion_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.account_deletion_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notebook_entries; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.notebook_entries (
    id bigint NOT NULL,
    notebook_id bigint NOT NULL,
    word_id bigint NOT NULL,
    user_note text,
    mastery_level integer DEFAULT 0,
    is_favorite boolean DEFAULT false,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notebook_entries_mastery_level_check CHECK (((mastery_level >= 0) AND (mastery_level <= 5)))
);



--
-- Name: notebook_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.notebook_entries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notebook_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notebooks; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.notebooks (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: notebooks_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.notebooks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notebooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: oauth_accounts; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.oauth_accounts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    provider_id bigint NOT NULL,
    provider_user_id character varying(255) NOT NULL,
    provider_email character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: oauth_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.oauth_accounts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.oauth_accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: oauth_providers; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.oauth_providers (
    id bigint NOT NULL,
    name character varying(50) NOT NULL
);



--
-- Name: oauth_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.oauth_providers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.oauth_providers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.otp_codes (
    id bigint NOT NULL,
    code_hash character varying(72) NOT NULL,
    user_id bigint NOT NULL,
    expiry_date timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

CREATE SEQUENCE public.otp_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: depravationdo
--

ALTER SEQUENCE public.otp_codes_id_seq OWNED BY public.otp_codes.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    token_hash character varying(64) NOT NULL,
    user_id bigint NOT NULL,
    expiry_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.password_reset_tokens ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quiz_results; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.quiz_results (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    category character varying(100) NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    wrong_count integer DEFAULT 0 NOT NULL,
    total_questions integer DEFAULT 10 NOT NULL,
    duration_seconds integer NOT NULL,
    wrong_words jsonb DEFAULT '[]'::jsonb,
    completed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: quiz_results_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.quiz_results ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quiz_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: registration_email_tokens; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.registration_email_tokens (
    id bigint NOT NULL,
    token_hash character varying(64) NOT NULL,
    user_id bigint NOT NULL,
    expiry_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: registration_email_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.registration_email_tokens ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.registration_email_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(30) NOT NULL,
    email character varying(320),
    password_hash character varying(255),
    nickname character varying(100),
    avatar_url character varying(2048),
    country_code character(2),
    bio text,
    linkedin_url character varying(500),
    is_admin boolean DEFAULT false,
    status character varying(20) DEFAULT 'INACTIVE'::character varying NOT NULL,
    email_verified boolean DEFAULT false,
    email_verified_at timestamp with time zone,
    last_login_at timestamp with time zone,
    last_login_ip inet,
    registration_ip inet,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'PENDING_DELETE'::character varying])::text[])))
);



--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: word_definitions; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.word_definitions (
    id bigint NOT NULL,
    word_id bigint NOT NULL,
    definition_en text NOT NULL,
    definition_cn text,
    pos character varying(50) NOT NULL,
    example_sentences jsonb DEFAULT '[]'::jsonb,
    categories text[] DEFAULT '{}'::text[],
    exam_tags text[] DEFAULT '{}'::text[],
    difficulty_level character varying(20),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT word_definitions_difficulty_level_check CHECK (((difficulty_level)::text = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying])::text[]))),
    CONSTRAINT word_definitions_pos_check CHECK (((pos)::text = ANY ((ARRAY['n.'::character varying, 'v.'::character varying, 'adj.'::character varying, 'adv.'::character varying, 'prep.'::character varying, 'conj.'::character varying, 'pron.'::character varying, 'interj.'::character varying, 'phrase'::character varying])::text[])))
);



--
-- Name: word_definitions_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.word_definitions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.word_definitions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: words; Type: TABLE; Schema: public; Owner: depravationdo
--

CREATE TABLE public.words (
    id bigint NOT NULL,
    word character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: words_id_seq; Type: SEQUENCE; Schema: public; Owner: depravationdo
--

ALTER TABLE public.words ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.words_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: otp_codes id; Type: DEFAULT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.otp_codes ALTER COLUMN id SET DEFAULT nextval('public.otp_codes_id_seq'::regclass);


--
-- Name: account_deletion_logs account_deletion_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.account_deletion_logs
    ADD CONSTRAINT account_deletion_logs_pkey PRIMARY KEY (id);


--
-- Name: notebook_entries notebook_entries_notebook_id_word_id_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.notebook_entries
    ADD CONSTRAINT notebook_entries_notebook_id_word_id_key UNIQUE (notebook_id, word_id);


--
-- Name: notebook_entries notebook_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.notebook_entries
    ADD CONSTRAINT notebook_entries_pkey PRIMARY KEY (id);


--
-- Name: notebooks notebooks_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.notebooks
    ADD CONSTRAINT notebooks_pkey PRIMARY KEY (id);


--
-- Name: oauth_accounts oauth_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.oauth_accounts
    ADD CONSTRAINT oauth_accounts_pkey PRIMARY KEY (id);


--
-- Name: oauth_accounts oauth_accounts_provider_id_provider_user_id_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.oauth_accounts
    ADD CONSTRAINT oauth_accounts_provider_id_provider_user_id_key UNIQUE (provider_id, provider_user_id);


--
-- Name: oauth_providers oauth_providers_name_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.oauth_providers
    ADD CONSTRAINT oauth_providers_name_key UNIQUE (name);


--
-- Name: oauth_providers oauth_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.oauth_providers
    ADD CONSTRAINT oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_code_hash_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_code_hash_key UNIQUE (code_hash);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: quiz_results quiz_results_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_pkey PRIMARY KEY (id);


--
-- Name: registration_email_tokens registration_email_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.registration_email_tokens
    ADD CONSTRAINT registration_email_tokens_pkey PRIMARY KEY (id);


--
-- Name: registration_email_tokens registration_email_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.registration_email_tokens
    ADD CONSTRAINT registration_email_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: word_definitions word_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.word_definitions
    ADD CONSTRAINT word_definitions_pkey PRIMARY KEY (id);


--
-- Name: word_definitions word_definitions_word_id_pos_definition_en_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.word_definitions
    ADD CONSTRAINT word_definitions_word_id_pos_definition_en_key UNIQUE (word_id, pos, definition_en);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- Name: words words_word_key; Type: CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_word_key UNIQUE (word);


--
-- Name: idx_deletion_created_at; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_deletion_created_at ON public.account_deletion_logs USING btree (created_at DESC);


--
-- Name: idx_deletion_reason_category; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_deletion_reason_category ON public.account_deletion_logs USING btree (reason_category);


--
-- Name: idx_deletion_user_id; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_deletion_user_id ON public.account_deletion_logs USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: idx_notebooks_user; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_notebooks_user ON public.notebooks USING btree (user_id);


--
-- Name: idx_oauth_accounts_user_id; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_oauth_accounts_user_id ON public.oauth_accounts USING btree (user_id);


--
-- Name: idx_otp_user_id; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_otp_user_id ON public.otp_codes USING btree (user_id);


--
-- Name: idx_otp_user_used; Type: INDEX; Schema: public; Owner: depravationdo
--

CREATE INDEX idx_otp_user_used ON public.otp_codes USING btree (user_id, is_used);


--
-- Name: notebooks update_notebooks_updated_at; Type: TRIGGER; Schema: public; Owner: depravationdo
--

CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON public.notebooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: notebook_entries notebook_entries_notebook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.notebook_entries
    ADD CONSTRAINT notebook_entries_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebooks(id) ON DELETE CASCADE;


--
-- Name: notebook_entries notebook_entries_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.notebook_entries
    ADD CONSTRAINT notebook_entries_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id) ON DELETE CASCADE;


--
-- Name: oauth_accounts oauth_accounts_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.oauth_accounts
    ADD CONSTRAINT oauth_accounts_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.oauth_providers(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quiz_results quiz_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: registration_email_tokens registration_email_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.registration_email_tokens
    ADD CONSTRAINT registration_email_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: word_definitions word_definitions_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: depravationdo
--

ALTER TABLE ONLY public.word_definitions
    ADD CONSTRAINT word_definitions_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


