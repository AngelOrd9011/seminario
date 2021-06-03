SET check_function_bodies = false;
CREATE TABLE public."catalogoEjemplo" (
    id integer NOT NULL,
    dato text NOT NULL
);
CREATE SEQUENCE public."catalogoEjemplo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."catalogoEjemplo_id_seq" OWNED BY public."catalogoEjemplo".id;
ALTER TABLE ONLY public."catalogoEjemplo" ALTER COLUMN id SET DEFAULT nextval('public."catalogoEjemplo_id_seq"'::regclass);
ALTER TABLE ONLY public."catalogoEjemplo"
    ADD CONSTRAINT "catalogoEjemplo_pkey" PRIMARY KEY (id);
