--3.1
INSERT INTO Carriers (cid, name) VALUES (-1, 'my carrier');
--3.2
-- assumption: the csv files are in the same folder as the .sql files
\copy Weekdays (did, day_of_week) FROM 'weekdays.csv' delimiter ',';
\copy Months (mid, month) FROM 'months.csv' delimiter ',';
\copy Carriers (cid, name) FROM 'carriers.csv' delimiter ',';
\copy Flights (fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) FROM 'flights.csv' delimiter ',';
--3.3
DELETE FROM Carriers WHERE cid='-1';
