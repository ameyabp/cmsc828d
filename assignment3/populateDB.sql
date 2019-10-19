CREATE TABLE Storms(
	eventID	int PRIMARY KEY,
	eventType	varchar(30),
	state	varchar(30),
	stateFips	int,
	czmType	char(1),
	countyFips	int,
--	countyName	varchar(100),
	lat	float,
	lng	float,
	beginDate	char(10),
	endDate	char(10),
	year int,
	injuries	int,
	deaths	float,
	damage	float
);

\copy Storms (eventID, eventType, state, stateFips, czmType, countyFips, lat, lng, beginDate, endDate, year, injuries, deaths, damage) FROM 'compositeStorms.csv' WITH delimiter ',' csv header;
