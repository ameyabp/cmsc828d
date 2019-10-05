CREATE DATABASE a3db;
CREATE USER a3user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE a3db TO a3user;

CREATE TABLE Plaza(
	fid	int,
	state	varchar(34),
	start	date
);