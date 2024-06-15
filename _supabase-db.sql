create table
  public.profile (
    user_id uuid not null,
    department character varying null,
    email character varying null,
    full_name character varying null,
    created_at timestamp with time zone not null default now(),
    constraint profile_pkey primary key (user_id),
    constraint public_profile_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.role_type (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    role_type character varying not null,
    priority smallint null,
    constraint role_type_pkey primary key (id)
  ) tablespace pg_default;

  INSERT INTO public.role_type (role_type, priority) VALUES
  ('owner', 1),
  ('manager', 2),
  ('member', 3);

create table
  public.project (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    description character varying null,
    is_archived boolean not null default false,
    constraint project_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.project_member (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    project_id bigint not null,
    user_id uuid not null,
    role_id bigint not null,
    constraint project_member_pkey primary key (id),
    constraint public_project_member_project_id_fkey foreign key (project_id) references project (id) on update cascade on delete cascade,
    constraint public_project_member_role_id_fkey foreign key (role_id) references role_type (id) on update cascade on delete cascade,
    constraint public_project_member_user_id_fkey foreign key (user_id) references profile (user_id) on update cascade on delete cascade
  ) tablespace pg_default;

create unique index idx_unique_project_user on public.project_member using btree (project_id, user_id) tablespace pg_default;

create table
  public.project_invite (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    project_id bigint not null,
    email character varying not null,
    role_id bigint not null,
    invited_by uuid null,
    constraint project_invite_pkey primary key (id),
    constraint public_project_invite_invited_by_fkey foreign key (invited_by) references profile (user_id) on update cascade on delete cascade,
    constraint public_project_invite_project_id_fkey foreign key (project_id) references project (id) on update cascade on delete cascade,
    constraint public_project_invite_role_id_fkey foreign key (role_id) references role_type (id) on update cascade on delete cascade
  ) tablespace pg_default;

create unique index idx_unique_project_invite on public.project_invite using btree (project_id, email) tablespace pg_default;

create table
  public.message (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    user_id uuid not null,
    content character varying null,
    project_id bigint null,
    constraint messages_pkey primary key (id),
    constraint public_messages_project_id_fkey foreign key (project_id) references project (id) on update cascade on delete set null,
    constraint public_messages_user_id_fkey foreign key (user_id) references profile (user_id) on update cascade on delete cascade
  ) tablespace pg_default;



--  Create table for default user tasks
create table
  public.user_task_default (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    user_id uuid not null default auth.uid (),
    name character varying not null,
    description character varying null,
    constraint user_task_default_pkey primary key (id),
    constraint user_task_default_user_id_fkey foreign key (user_id) references profile (user_id) on update cascade on delete cascade
  ) tablespace pg_default;

  -- Create table for project tasks
  create table
  public.project_task (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    project_id bigint null,
    name character varying not null,
    description character varying null,
    is_deleted boolean not null default false,
    constraint project_task_pkey primary key (id),
    constraint project_task_project_id_fkey foreign key (project_id) references project (id) on update cascade on delete cascade
  ) tablespace pg_default;

CREATE OR REPLACE FUNCTION public.add_new_project(
    _name varchar,
    _description varchar,
    _user_id uuid
)
 RETURNS SETOF public.project
 LANGUAGE plpgsql
AS $function$
    declare _project_id int;
    declare _role_id int;
begin
  SELECT id into _role_id FROM role_type WHERE role_type = 'owner';
  INSERT into project
    (name, description)
    values (_name, _description)
    returning id
    into _project_id;
  INSERT into project_member
    (project_id, user_id, role_id)
     values (_project_id, _user_id, _role_id);
  INSERT INTO project_task
    (project_id, name, description)
    SELECT _project_id, user_task_default.name, user_task_default.description FROM user_task_default
    WHERE user_task_default.user_id = _user_id;
RETURN query select * from project where project.id = _project_id;
END$function$