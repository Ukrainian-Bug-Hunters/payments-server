-- load uuid extention:
create extension if not exists "uuid-ossp";

-- drop existing tables:
drop table if exists public.payments;

CREATE TABLE public.payments (
	id uuid default uuid_generate_v4(),
	"date" text, 
	currency text, 
	amount float, 
	"exchangeRate" float, 
	description text, 
	direction varchar(3),
	status text
);