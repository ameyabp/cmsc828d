ALTER TABLE Flights ADD PRIMARY KEY(fid)
ALTER TABLE Carriers ADD PRIMARY KEY(cid)
ALTER TABLE Months ADD PRIMARY KEY(mid)
ALTER TABLE Weekdays ADD PRIMARY KEY(did)

ALTER TABLE Flights ADD CONSTRAINT flights2carriers FOREIGN KEY(carrier_id) REFERENCES Carriers(cid);
ALTER TABLE Flights ADD CONSTRAINT flights2months FOREIGN KEY(month_id) REFERENCES Months(mid);
ALTER TABLE Flights ADD CONSTRAINT flights2weekdays FOREIGN KEY(day_of_week_id) REFERENCES Weekdays(did);

INSERT INTO Carriers(cid, name) VALUES('IA', 'Indian Airlines');
--answer:
--ERROR:  duplicate KEY value violates unique CONSTRAINT "Carriers_pkey"
--DETAIL:  Key (cid)=(IA) already exists.
--since cid='IA' already exists in the TABLE and cid is the preimary KEY, a new entry with the same cid is not allowed, irrespective of the name attribute
--if the PRIMARY KEY CONSTRAINT did not exist, it would have created a new entry cid='IA', name='Indian Airlines', alongside the previous entry cid='IA', name='Iraqi Airways'
INSERT INTO Flights(fid, month_id, day_of_month, day_of_week_id, carrier_id, flight_num, origin_city, origin_state, dest_city, dest_state, departure_delay, taxi_out, arrival_delay, cancelled, actual_time, distance, capacity, price) VALUES(10485870, 9, 2, 4, 'KNA', 7962, 'Washington DC', 'Virginia', 'Mumbai MH', 'Maharashtra', 0, 0, 0, 0, 1080, 12839, 100, 60000);
--answer:
--ERROR:  INSERT or update on TABLE Flights violates FOREIGN KEY CONSTRAINT "flights2carriers"
--DETAIL:  Key (carrier_id)=(KNA) is not present in TABLE Carriers.
--since carrier_id='KNA' does not exist in the Carriers TABLE, such an entry addition was not allowed in Flights TABLE
--if FOREIGN KEY CONSTRAINT was not added, the above insertion would have been allowed

DELETE FROM Carriers WHERE cid='AA';
--answer:
--ERROR:  update or DELETE on TABLE Carriers violates FOREIGN KEY CONSTRAINT "flights2carriers" on TABLE Flights
--DETAIL:  Key (cid)=(AA) is still referenced FROM TABLE Flights.
--such a deletion would not be allowed before all the REFERENCES to that partiuclar cid are removed FROM the child tables