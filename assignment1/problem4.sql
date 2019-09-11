--4.1
SELECT Carriers.name FROM (SELECT DISTINCT(carrier_id) AS cid FROM Flights GROUP BY carrier_id, month_id, day_of_month HAVING COUNT(fid) > 1000) AS Query1 NATURAL JOIN Carriers;
--4.2
SELECT name AS carrier, max_price FROM (SELECT carrier_id AS cid, MAX(price) AS max_price FROM Flights WHERE (origin_city = 'Washington DC' AND dest_city = 'Seattle WA') OR (origin_city = 'Seattle WA' AND dest_city = 'Washington DC') GROUP BY carrier_id) AS Query2 NATURAL JOIN Carriers;
--4.3
SELECT DISTINCT(flight_num) FROM Flights WHERE origin_city='Seattle WA' AND dest_city='Boston MA' AND day_of_week_id=(SELECT did FROM Weekdays WHERE day_of_week='Monday') AND carrier_id=(SELECT cid FROM Carriers WHERE name='Alaska Airlines Inc.');
--4.4
SELECT cid, name FROM (SELECT * FROM (SELECT carrier_id AS cid, COUNT(fid) AS numFlights FROM Flights GROUP BY carrier_id) AS query41 WHERE query41.numFlights=(SELECT MIN(numFlights) FROM (SELECT carrier_id AS cid, COUNT(fid) AS numFlights FROM Flights GROUP BY carrier_id) AS query42)) AS query43 NATURAL JOIN Carriers;
--4.5
SELECT * FROM (SELECT day_of_week_id AS did FROM (SELECT day_of_week_id, AVG(price) FROM Flights GROUP BY day_of_week_id) AS query51 WHERE AVG=(SELECT MAX(AVG) FROM (SELECT day_of_week_id, AVG(price) FROM Flights GROUP BY day_of_week_id) AS query52)) AS query53 NATURAL JOIN Weekdays;
--4.6
SELECT name, percent FROM (SELECT cid, cast(total_cancelled AS float)/cast(total_flights AS float) * 100 AS percent FROM (SELECT carrier_id AS cid, COUNT(fid) AS total_flights, SUM(cancelled) AS total_cancelled FROM Flights WHERE origin_city='Washington DC' GROUP BY carrier_id) AS query61) AS query62 NATURAL JOIN Carriers WHERE percent > 0.5 ORDER BY percent;
--4.7
SELECT name, delay FROM (SELECT carrier_id AS cid, SUM(departure_delay) AS delay FROM Flights GROUP BY carrier_id) AS query7 NATURAL JOIN Carriers;
--4.8
SELECT name, f1_flight_num, f1_origin_city, f1_dest_city, f1_actual_time, f2_flight_num, f2_origin_city, f2_dest_city, f2_actual_time, actual_time FROM (SELECT query81.carrier_id AS cid, query81.fid AS f1_flight_num, query81.origin_city AS f1_origin_city, query81.dest_city AS f1_dest_city, query81.actual_time AS f1_actual_time, query82.fid AS f2_flight_num, query82.origin_city AS f2_origin_city, query82.dest_city AS f2_dest_city, query82.actual_time AS f2_actual_time, query81.actual_time+query82.actual_time AS actual_time FROM (SELECT * FROM Flights WHERE origin_city='Washington DC' AND day_of_month=15) AS query81 INNER JOIN (SELECT * FROM Flights WHERE dest_city='Las Vegas NV' AND day_of_month=15) AS query82 ON query81.dest_city=query82.origin_city AND query81.carrier_id=query82.carrier_id WHERE query81.actual_time+query82.actual_time < 480) AS query83 NATURAL JOIN Carriers;