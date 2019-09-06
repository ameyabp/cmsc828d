# WINDOWS environment
# set environment variable PGUSER=postgres
1 Creating databASe
createdb a1
psql a1

2 Creating tables
CREATE TABLE "Flights" (	--double quotes make the TABLE name case sensitive
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
3.2 \copy "Weekdays" (did, day_of_week) FROM 'C:\Users\crica\Documents\UMD\CMSC828D\ASsignment1\ASsignment1\weekdays.csv' delimiter ',';
	\copy "Months" (mid, month) FROM 'C:\Users\crica\Documents\UMD\CMSC828D\ASsignment1\ASsignment1\months.csv' delimiter ',';
	\copy "Carriers" (cid, name) FROM 'C:\Users\crica\Documents\UMD\CMSC828D\ASsignment1\ASsignment1\carriers.csv' delimiter ',';
	\copy "Flights" (fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) FROM 'C:\Users\crica\Documents\UMD\CMSC828D\ASsignment1\ASsignment1\flights.csv' delimiter ',';
3.3 DELETE FROM "Carriers" WHERE cid='-1';

4 SQL Queries
4.1 SELECT "Carriers".name FROM (SELECT DISTINCT(carrier_id) AS cid FROM "Flights" GROUP BY carrier_id, month_id, day_of_month HAVING COUNT(fid) > 1000) AS Query1 NATURAL JOIN "Carriers";
4.2 SELECT name AS carrier, max_price FROM (SELECT carrier_id AS cid, MAX(price) AS max_price FROM "Flights" WHERE (origin_city = 'Washington DC' AND dest_city = 'Seattle WA') OR (origin_city = 'Seattle WA' AND dest_city = 'Washington DC') GROUP BY carrier_id) AS Query2 NATURAL JOIN "Carriers";
4.3 SELECT fid AS flight_num FROM "Flights" WHERE origin_city='Seattle WA' AND dest_city='Boston MA' AND day_of_week_id=(SELECT did FROM "Weekdays" WHERE day_of_week='Monday') AND carrier_id=(SELECT cid FROM "Carriers" WHERE name='Alaska Airlines Inc.');
4.4 SELECT cid, name FROM (SELECT * FROM (SELECT carrier_id AS cid, COUNT(fid) AS numFlights FROM "Flights" GROUP BY carrier_id) AS query41 WHERE query41.numFlights=(SELECT MIN(numFlights) FROM (SELECT carrier_id AS cid, COUNT(fid) AS numFlights FROM "Flights" GROUP BY carrier_id) AS query42)) AS query43 NATURAL JOIN "Carriers";
4.5 SELECT * FROM (SELECT day_of_week_id AS did FROM (SELECT day_of_week_id, AVG(price) FROM "Flights" GROUP BY day_of_week_id) AS query51 WHERE AVG=(SELECT MAX(AVG) FROM (SELECT day_of_week_id, AVG(price) FROM "Flights" GROUP BY day_of_week_id) AS query52)) AS query53 NATURAL JOIN "Weekdays";
4.6 SELECT name, percent FROM (SELECT cid, cASt(total_cancelled AS float)/cASt(total_flights AS float) * 100 AS percent FROM (SELECT carrier_id AS cid, COUNT(fid) AS total_flights, SUM(cancelled) AS total_cancelled FROM "Flights" WHERE origin_city='Washington DC' GROUP BY carrier_id) AS query61) AS query62 NATURAL JOIN "Carriers" WHERE percent > 0.5 ORDER BY percent;
4.7 SELECT name, delay FROM (SELECT carrier_id AS cid, SUM(departure_delay) AS delay FROM "Flights" GROUP BY carrier_id) AS query7 NATURAL JOIN "Carriers";
4.8 SELECT name, f1_flight_num, f1_origin_city, f1_dest_city, f1_actual_time, f2_flight_num, f2_origin_city, f2_dest_city, f2_actual_time, actual_time FROM (SELECT query81.carrier_id AS cid, query81.fid AS f1_flight_num, query81.origin_city AS f1_origin_city, query81.dest_city AS f1_dest_city, query81.actual_time AS f1_actual_time, query82.fid AS f2_flight_num, query82.origin_city AS f2_origin_city, query82.dest_city AS f2_dest_city, query82.actual_time AS f2_actual_time, query81.actual_time+query82.actual_time AS actual_time FROM (SELECT * FROM "Flights" WHERE origin_city='Washington DC' AND day_of_month=15) AS query81 INNER JOIN (SELECT * FROM "Flights" WHERE dest_city='Las Vegas NV' AND day_of_month=15) AS query82 ON query81.dest_city=query82.origin_city AND query81.carrier_id=query82.carrier_id WHERE query81.actual_time+query82.actual_time < 480) AS query83 NATURAL JOIN "Carriers";

6 Integrity constraints
6.1 ALTER TABLE "Flights" ADD PRIMARY KEY(fid)
	ALTER TABLE "Carriers" ADD PRIMARY KEY(cid)
	ALTER TABLE "Months" ADD PRIMARY KEY(mid)
	ALTER TABLE "Weekdays" ADD PRIMARY KEY(did)
6.2 ALTER TABLE "Flights" ADD CONSTRAINT flights2carriers FOREIGN KEY(carrier_id) REFERENCES "Carriers"(cid);
	ALTER TABLE "Flights" ADD CONSTRAINT flights2months FOREIGN KEY(month_id) REFERENCES "Months"(mid);
	ALTER TABLE "Flights" ADD CONSTRAINT flights2weekdays FOREIGN KEY(day_of_week_id) REFERENCES "Weekdays"(did);
6.3 INSERT INTO "Carriers"(cid, name) VALUES('IA', 'Indian Airlines');
    # answer:
    # ERROR:  duplicate KEY value violates unique CONSTRAINT "Carriers_pkey"
    # DETAIL:  Key (cid)=(IA) already exists.
    # since cid='IA' already exists in the TABLE and cid is the preimary KEY, a new entry with the same cid is not allowed, irrespective of the name attribute
    # if the PRIMARY KEY CONSTRAINT did not exist, it would have created a new entry cid='IA', name='Indian Airlines', alongside the previous entry cid='IA', name='Iraqi Airways'
    INSERT INTO "Flights"(fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) VALUES(10485870, 9, 2, 4, 'KNA', 7962, 'Washington DC', 'Virginia', 'Mumbai MH', 'Maharashtra', 0, 0, 0, 0, 1080, 12839, 100, 60000);
    # answer:
    # ERROR:  INSERT or update on TABLE "Flights" violates FOREIGN KEY CONSTRAINT "flights2carriers"
    # DETAIL:  Key (carrier_id)=(KNA) is not present in TABLE "Carriers".
    # since carrier_id='KNA' does not exist in the Carriers TABLE, such an entry addition was not allowed in Flights TABLE
    # if FOREIGN KEY CONSTRAINT was not added, the above insertion would have been allowed
6.4 DELETE FROM "Carriers" WHERE cid='AA';
    # answer:
    # ERROR:  update or DELETE on TABLE "Carriers" violates FOREIGN KEY CONSTRAINT "flights2carriers" on TABLE "Flights"
    # DETAIL:  Key (cid)=(AA) is still referenced FROM TABLE "Flights".
    # such a deletion would not be allowed before all the REFERENCES to that partiuclar cid are removed FROM the child tables

8 Views
8.1 CREATE VIEW query81 AS SELECT * FROM "Flights" WHERE price < 700;
8.2 SELECT * FROM query81 WHERE origin_city like '%Fort%' OR dest_city like '%Fort%';
8.3 CREATE VIEW query83 AS SELECT did, day_of_week, cid, name AS carrier_name FROM (((SELECT day_of_week_id AS did, carrier_id AS cid FROM "Flights") AS query831 NATURAL JOIN "Weekdays") AS query832 NATURAL JOIN "Carriers") AS query833;
8.4 # Views provide a kind of a window for looking at selective attributes FROM multiple tables in the database
    # It also modularizes a resulting set of tuples FROM a TABLE, and creates a new entity or alias FROM it so that it can be used in multiple places for different queries (AS was done in my answer for 4.4), thus making it easier to write queries
    # It also makes the query easier to read by breaking it down INTO multiple independent steps so that debugging becomes easy
8.5 INSERT INTO query83(did, day_of_week, cid, carrier_name) VALUES(3, 'Wednesday', 'IA', 'Iraqi Airways');
    # answer
    # ERROR:  cannot INSERT INTO VIEW "query83"
    # DETAIL:  Views that do not SELECT FROM a single TABLE or VIEW are not automatically updatable.
    # HINT:  To enable inserting INTO the VIEW, provide an INSTEAD OF INSERT trigger or an unconditional ON INSERT DO INSTEAD rule.
    # insertion INTO a VIEW is not allowed because views could be projecting only a SELECT few attributes FROM the various joins of multiple tables, and an INSERT INTO a VIEW might not specify VALUES for all the attributes of the source tables
    # As the hint suggests, users cannot be directly allowed to INSERT tuples INTO views. It can be allowed though if the user also specifies what VALUES are to be added to the attributes of contributing tables which are not a part of the VIEW.
    # Allowing VIEW updates would also have an additional requirement of creating a graph like struture to keep track of changes made to the constituent tables.
    # But since the system already keeps a track of the constituent tables, it might not be too much of work to actually wire up and reflect the changes in views to the constituent tables and it would be a helpful feature to have.