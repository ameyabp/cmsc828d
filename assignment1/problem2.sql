CREATE TABLE Flights (
    fid             int,
    month_id        int,
    day_of_month    int,
    day_of_week_id  int,
    carrier_id      varchar(7),
    flight_num      int,
    origin_city     varchar(34),
    origin_state    varchar(47),
    dest_city       varchar(34),
    dest_state      varchar(47),
    departure_delay int,
    taxi_out        int,
    arrival_delay   int,
    cancelled       int,
    actual_time     int,
    distance        int,
    capacity        int,
    price           int
);

CREATE TABLE Carriers (
    cid             varchar(7),
    name            varchar(83)
);

CREATE TABLE Months (
    mid             int,
    month           varchar(9)
);

CREATE TABLE Weekdays (
    did             int,
    day_of_week     varchar(9)
);
