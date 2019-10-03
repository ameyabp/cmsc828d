--8.1
CREATE VIEW query81 AS SELECT * FROM Flights WHERE price < 700;
--8.2
SELECT * FROM query81 WHERE origin_city like '%Fort%' OR dest_city like '%Fort%';
--8.3
CREATE VIEW query83 AS SELECT did, day_of_week, cid, name AS carrier_name FROM (((SELECT day_of_week_id AS did, carrier_id AS cid FROM Flights) AS query831 NATURAL JOIN Weekdays) AS query832 NATURAL JOIN Carriers) AS query833;

--8.4
--Views provide a kind of a window for looking at selective attributes FROM multiple tables in the database
--It also modularizes a resulting set of tuples FROM a TABLE, and creates a new entity or alias FROM it so that it can be used in multiple places for different queries (AS was done in my answer for 4.4 and 4.5) and even across multiple sessions, thus making it easier to write queries
--It also makes the query easier to read by breaking it down INTO multiple independent steps so that debugging becomes easy

--8.5
INSERT INTO query83(did, day_of_week, cid, carrier_name) VALUES(3, 'Wednesday', 'IA', 'Iraqi Airways');
--answer
--ERROR:  cannot INSERT INTO VIEW "query83"
--DETAIL:  Views that do not SELECT FROM a single TABLE or VIEW are not automatically updatable.
--HINT:  To enable inserting INTO the VIEW, provide an INSTEAD OF INSERT trigger or an unconditional ON INSERT DO INSTEAD rule.
--insertion INTO a VIEW is not allowed because views could be projecting only a SELECT few attributes FROM the various joins of multiple tables, and an INSERT INTO a VIEW might not specify VALUES for all the attributes of the source tables
--As the hint suggests, users cannot be directly allowed to INSERT tuples INTO views. It can be allowed though if the user also specifies what VALUES are to be added to the attributes of contributing tables which are not a part of the VIEW.
--Allowing VIEW updates would also have an additional requirement of creating a graph like struture to keep track of changes made to the constituent tables.
--But since the system already keeps a track of the constituent tables, it might not be too much of work to actually wire up and reflect the changes in views to the constituent tables and it would be a helpful feature to have.