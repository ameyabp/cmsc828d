# WINDOWS environment
# set environment variable PGUSER=postgres
1 Creating database
createdb a1
psql a1

2 Creating tables
CREATE TABLE "Flights" (	--double quotes make the table name case sensitive
	fid				int,
	month_id		int,
	day_of_month	int,
	day_of_week_id	int,
	carrier_id		varchar(7),
	flight_num		int,
	origin_city		varchar(34),
	origin_state	varchar(47),
	dest_city		varchar(34),
	dest_state		varchar(47),
	departure_delay	int,
	taxi_out		int,
	arrival_delay	int,
	cancelled		int,
	actual_time		int,
	distance		int,
	capacity		int,
	price			int
);

CREATE TABLE "Carriers" (
	cid				varchar(7),
	name			varchar(83)
);

CREATE TABLE "Months" (
	mid				int,
	month			varchar(9)
);

CREATE TABLE "Weekdays" (
	did				int,
	day_of_week		varchar(9)
);

3 Loading data
3.1 INSERT INTO "Carriers" (cid, name) VALUES (-1, 'my carrier');
3.2 \copy "Weekdays" (did, day_of_week) from 'C:\Users\crica\Documents\UMD\CMSC828D\assignment1\assignment1\weekdays.csv' delimiter ',';
	\copy "Months" (mid, month) from 'C:\Users\crica\Documents\UMD\CMSC828D\assignment1\assignment1\months.csv' delimiter ',';
	\copy "Carriers" (cid, name) from 'C:\Users\crica\Documents\UMD\CMSC828D\assignment1\assignment1\carriers.csv' delimiter ',';
	\copy "Flights" (fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) from 'C:\Users\crica\Documents\UMD\CMSC828D\assignment1\assignment1\flights.csv' delimiter ',';
3.3 delete from "Carriers" where cid='-1';

4 SQL Queries
4.1 SELECT "Carriers".name FROM (SELECT DISTINCT(carrier_id) AS cid FROM "Flights" GROUP BY carrier_id, month_id, day_of_month HAVING COUNT(fid) > 1000) AS Query1 NATURAL JOIN "Carriers";
4.2 SELECT name AS carrier, max_price FROM (SELECT carrier_id AS cid, MAX(price) AS max_price FROM "Flights" WHERE (origin_city = 'Washington DC' AND dest_city = 'Seattle WA') OR (origin_city = 'Seattle WA' AND dest_city = 'Washington DC') GROUP BY carrier_id) AS Query2 NATURAL JOIN "Carriers";