--3.1
INSERT INTO Carriers (cid, name) VALUES (-1, 'my carrier');
--3.2
\copy Weekdays (did, day_of_week) FROM 'C:\Users\crica\Documents\UMD\cmsc828d\assignment1\weekdays.csv' delimiter ',';
\copy Months (mid, month) FROM 'C:\Users\crica\Documents\UMD\cmsc828d\assignment1\months.csv' delimiter ',';
\copy Carriers (cid, name) FROM 'C:\Users\crica\Documents\UMD\cmsc828d\assignment1\carriers.csv' delimiter ',';
\copy Flights (fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) FROM 'C:\Users\crica\Documents\UMD\cmsc828d\assignment1\flights.csv' delimiter ',';
--3.3
DELETE FROM Carriers WHERE cid='-1';